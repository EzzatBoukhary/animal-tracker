import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'api_service.dart';
import 'dart:convert';
// import 'package:cached_network_image/cached_network_image.dart';
// import 'package:flutter_spinkit/flutter_spinkit.dart';

String timeAgo(DateTime postDate) {
  final now = DateTime.now();
  final difference = now.difference(postDate);

  if (difference.inMinutes < 60) {
    return '${difference.inMinutes} mins ago';
  } else if (difference.inHours < 24) {
    return '${difference.inHours} hours ago';
  } else if (difference.inDays < 30) {
    return '${difference.inDays} days ago';
  } else if (difference.inDays < 365) {
    final months = (difference.inDays / 30).floor();
    return '$months months ago';
  } else {
    final years = (difference.inDays / 365).floor();
    return '$years years ago';
  }
}

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  MapPageState createState() => MapPageState();
}

class MapPageState extends State<MapPage> {
  final MapController _mapController = MapController();
  List<Marker> _markers = [];
  String? _selectedAnimal;
  final List<String> _animalTypes = ['Cat', 'Racoon', 'Turtle', 'Other'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Filters', 
              style: TextStyle(
                color: Colors.white,
              ),
            ),
            PopupMenuButton<String>(
              icon: Icon(Icons.filter_list, color: Colors.white),
              onSelected: (String animal) {
                setState(() {
                  _selectedAnimal = animal;
                  _applyFilters(); // Apply the filter immediately
                });
              },
              itemBuilder: (BuildContext context) {
                return _animalTypes.map((String animal) {
                  return CheckedPopupMenuItem<String>(
                    value: animal,
                    // checked: _selectedAnimal.contains(animal),
                    child: Text(
                      animal,
                      style: TextStyle(
                        color: Colors.black,
                      ),
                    ),
                  );
                }).toList();
              },
              color: Colors.white,
            ),
          ],
        ),
      ),
      body: Container(
        color: Colors.black,
        child: Stack(
          children: [
            Center(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: const Color(0xFFFFC904),
                    width: 4,
                  )
                ),
                height: MediaQuery.of(context).size.height * 0.6,
                width: MediaQuery.of(context).size.width * 0.8,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20.0),
                  child: FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: LatLng(28.60221, -81.20031), // Default to San Francisco; replace as needed
                      initialZoom: 15,
                      onTap: (_, __) => _hideDetailsBottomSheet(), // Hide details if map is tapped
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      ),
                      MarkerLayer(
                        markers: _markers,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if(_markers.isEmpty)
              Center(
                child: Text(
                  "No markers available.",
                  style: TextStyle(
                    color: Colors.black, 
                    fontSize: 18,
                  ),
                ),
              )
          ],
        ),
      ),
    );
  }

  // Fetch filtered results and update markers
  Future<void> _applyFilters() async {
    ApiService apiService = ApiService();
    List<dynamic> posts = await apiService.fetchFilteredPosts(_selectedAnimal);

    setState(() {
      _markers = posts.map((post) {
        LatLng location = LatLng(post['location']['latitude'], post['location']['longitude']);
        return Marker(
          width: 40.0,
          height: 40.0,
          point: location,
          child: GestureDetector(
            onTap: () {
              _showDetailsBottomSheet(post);
            },
            child: Icon(
              Icons.location_on, 
              color: Colors.red, 
              size: 40
            ),
          ),
        );
      }).toList();
    });
  }

  // Show details in a bottom sheet when a marker is tapped
  void _showDetailsBottomSheet(Map<String, dynamic> post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return SizedBox(
          height: MediaQuery.of(context).size.height * 0.8, // 80% of screen height
          child: PostDetailsBottomSheet(post: post), // Your existing content here
        );
      },
      // context: context,
      // backgroundColor: Colors.white,
      // builder: (BuildContext context) {
      //   return Container(
      //     padding: EdgeInsets.all(16.0),
      //     color: Colors.white,
      //     child: Column(
      //       mainAxisSize: MainAxisSize.min,
      //       children: [
      //         Text("Details", style: TextStyle(fontSize: 18.0)),
      //         SizedBox(height: 10),
      //         Text("Animal: ${post['animal']}"),
      //         Text("Description: ${post['description']}"),
      //         Text("Posted by: ${post['username']}"),
      //         if (post['photo'] != null)
      //           CachedNetworkImage(
      //             imageUrl: post['photo'],
      //             placeholder: (context, url) => SpinKitCircle(color: Colors.blue),
      //             errorWidget: (context, url, error) => Icon(Icons.error),
      //           ),
      //       ],
      //     ),
      //   );
      // },
    );
  }


  void _hideDetailsBottomSheet() {
    if (Navigator.canPop(context)) {
      Navigator.of(context).pop();
    }
  }
}

class PostDetailsBottomSheet extends StatelessWidget {
  final dynamic post;

  const PostDetailsBottomSheet({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    final latitude = post['location']['latitude'];
    final longitude = post['location']['longitude'];

    

    return SingleChildScrollView(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(16.0)),
        ),
        
        child: Padding(
          padding: EdgeInsets.only(
            left: 16.0,
            right: 16.0,
            top: 16.0,
            bottom: MediaQuery.of(context).viewInsets.bottom + 16.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(62.0),
                  child: Builder(
                    builder: (context) {
                      try {
                        // Remove metadata prefix if it exists
                        String base64String = post['photo'];
                        if (base64String.contains(',')) {
                          base64String = base64String.split(',').last;
                        }

                        // Decode and display the image
                        return Image.memory(
                          Base64Decoder().convert(base64String),
                          fit: BoxFit.cover,
                          width: 300,
                          height: 300,
                        );
                      } catch (e) {
                        // Handle errors gracefully
                        return Center(
                          child: Text(
                            'Image failed to load',
                            style: TextStyle(color: Colors.red),
                          ),
                        );
                      }
                    },
                  ),
                ),
              ),
              SizedBox(height: 16),
              //spotted on and by who
              RichText(
                text: TextSpan(
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20.0,
                  ),
                  children: <TextSpan>[
                    TextSpan(text: 
                      'Spotted:', 
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    TextSpan(text: 
                      ' ',
                    ),
                    TextSpan(text: 
                      timeAgo(DateTime.parse(post['postedDate'])),
                    ),
                    TextSpan(text: 
                      ' by ${post['username']}'
                    )
                  ],
                ),
              ),
              SizedBox(height: 16),
              RichText(
                text: TextSpan(
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20.0,
                  ),
                  children: <TextSpan>[
                    TextSpan(text: 
                      'Animal Name:', 
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    TextSpan(text: 
                      ' ${post['animal']}'
                    )
                  ],
                ),
              ),
              SizedBox(height: 20),
              Center(
                child: Column(
                  children: [
                    Text(
                      'Description:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 25,
                        decoration: TextDecoration.underline,
                      ), 
                    ),
                    SizedBox(height: 16),
                    Container(
                      width: 300,
                      padding: EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Colors.grey.shade200,
                        border: Border.all(
                          color: Colors.black,
                          width: 3,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          post['description'],
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Map Location:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        decoration: TextDecoration.underline,
                      ), 
                    ),
                    SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.black,
                          width: 3,
                        ),
                      ),
                      height: 300,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20.0),
                        child: FlutterMap(
                          mapController: MapController(),
                          options: MapOptions(
                            initialCenter: LatLng(latitude, longitude),
                            initialZoom: 15.0,
                          ),
                          children: [
                            TileLayer(
                              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            ),
                            MarkerLayer(
                              markers: [
                                Marker(
                                  point: LatLng(latitude, longitude),
                                  child: Icon(
                                    Icons.location_pin,
                                    size: 40,
                                    color: Colors.red,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'api_service.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'dart:convert';


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

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});


  @override
  PostsPageState createState() => PostsPageState();
}

class PostsPageState extends State<PostsPage> {
  List<dynamic> posts = [];
  int currentPage = 1;
  bool isLoading = false;
  int? selectedIndex;

  @override
  void initState() {
    super.initState();
    fetchPosts();
  }

  Future<void> fetchPosts() async {
    if (isLoading || !mounted) return;
    setState(() { isLoading = true; });

    try {
      ApiService apiService = ApiService();
      final newPosts = await apiService.fetchPosts(currentPage,8);

      setState(() {
        posts.addAll(newPosts);
        currentPage++;
        isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() { isLoading = false; });
      }
      // print('Error fetching posts: $e');
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      child: NotificationListener<ScrollNotification>(
        onNotification: (ScrollNotification scrollInfo) {
          if (!isLoading && scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent) {
            fetchPosts();
          }
          return true;
        },
        child: GridView.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, // Number of posts per row
            crossAxisSpacing: 8.0, // Space between columns
            mainAxisSpacing: 8.0, // Space between rows
            childAspectRatio: 0.9, // Keeps the posts square (150x150)
          ),
          itemCount: posts.length + 1,
          itemBuilder: (context, index) {
            if (index < posts.length) {
              final post = posts[index];
      
              return GestureDetector(
                onTap: (){ //think about if i want this to be double tap or stay single tap
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    builder: (BuildContext context) {
                      return SizedBox(
                        height: MediaQuery.of(context).size.height * 0.8, // 80% of screen height
                        child: PostDetailsBottomSheet(post: post), // Your existing content here
                      );
                    },
                  );
                }, 
                child: Container(
                  margin: EdgeInsets.symmetric(horizontal: 9, vertical: 6),
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(10),
                    // border: Border.all(width: 1.0, color: Colors.grey[700]!),
                  ),
                  child: Column(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            width: 3,
                            color: Colors.white,
                          ),
                          borderRadius: BorderRadius.circular(65.0),
                          color: Colors.white,
                        ),
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
                                width: 150,
                                height: 150,
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
                      SizedBox(height: 1),
                      RichText(
                        text: TextSpan(
                          style: TextStyle(
                            color: Colors.white,
                          ),
                          children: <TextSpan>[
                            TextSpan(text: 
                              'Spotted:', 
                              style: TextStyle(
                                decoration: TextDecoration.underline,
                              ),
                            ),
                            TextSpan(text: 
                              ' ', 
                            ),
                            TextSpan(text: 
                              timeAgo(DateTime.parse(post['postedDate'])),
                            ),
                          ]
                        ),
                      ),
                    ],
                  ),
                ),
              );
            } else {
              return Center(
                child: isLoading ? CircularProgressIndicator() : SizedBox.shrink(),
              );
            }
          },
        ),
      ),
    );
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

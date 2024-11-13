import 'package:flutter/material.dart';
//import 'package:http/http.dart' as http;
//import 'dart:convert';
import 'api_service.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class PostsPage extends StatefulWidget {
  @override
  _PostsPageState createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
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
      final newPosts = await ApiService.fetchPosts(currentPage, 5);

      // for (var post in newPosts) {
      //   final firstName = await ApiService.getUserFirstName(post['userId']);
      //   post['firstName'] = firstName;  // Add firstName to the post
      // }

      setState(() {
        posts.addAll(newPosts);
        currentPage++;
        isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() { isLoading = false; });
      }
      print('Error fetching posts: $e');
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (ScrollNotification scrollInfo) {
        if (!isLoading && scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent) {
          fetchPosts();
        }
        return true;
      },
      child: ListView.builder(
        itemCount: posts.length + 1,
        itemBuilder: (context, index) {
          if (index < posts.length) {
            final post = posts[index];
            final isSelected = selectedIndex == index;

            return GestureDetector(
              onTap: (){ //think about if i want this to be double tap or stay single tap
                setState(() {
                  selectedIndex = isSelected ? null : index;
                });
              }, 
              child: AnimatedContainer(
                duration: Duration(milliseconds: 200),
                margin: EdgeInsets.symmetric(horizontal: 9, vertical: 6),
                padding: EdgeInsets.all(10),
                height: isSelected ? 300 : 125,
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xffFFC904) : const Color(0x33FFC904), // Change background color based on selection
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    width: 1.0,
                    style: BorderStyle.solid 
                  ) // Optional: to give it rounded corners
                ),
                child: Row(
                  children: [
                    AnimatedContainer(
                      duration: Duration(microseconds: 250),
                      width: isSelected ? 250 : 75,
                      height: isSelected ? 250 : 75,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4.0),
                        child: FadeInImage.assetNetwork(
                          placeholder: 'loading.png',
                          image: post['photo'],
                          fit: BoxFit.fitHeight
                        ),
                      ) 
                    ),
                    Expanded(
                      flex: 3,
                      child: Padding(                        
                        padding: const EdgeInsets.all(1.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            ListTile(
                              title: Text(
                                '${post['username']} - ${post['animal']}',
                                style: TextStyle(fontSize: isSelected ? 24 : 16),
                              ),
                              subtitle: Text(
                                post['description'],
                                maxLines: isSelected ? 10 : 2,
                                overflow: TextOverflow.ellipsis,
                              ),

                              /*
                              UNCOMMENT BELOW LINES IF DECIDED TO ADD TEST UNDER ICON BUTTON
                              */
                              trailing: //Column(
                                // mainAxisAlignment: MainAxisAlignment.start,
                                // children: [
                                  IconButton(
                                    icon: Icon(Icons.location_pin),
                                    onPressed: (){
                                      final latitude = post['location']['latitude'];
                                      final longitude = post['location']['longitude'];
                                      showModalBottomSheet(
                                        context: context,
                                        isScrollControlled: true,
                                        builder: (context) => MapBottomSheet(latitude: latitude, longitude: longitude),
                                      );
                                      //add map function call here
                                    },
                                  ),
                                  // SizedBox(height: 4),  // Optional: Adds space between icon and text
                                  // Text(
                                  //   'Location', // Text under the icon
                                  //   style: TextStyle(fontSize: 10),  // Adjust font size if necessary
                                  // ),
                                // ],
                              // ),
                            ),
                          ],
                        )
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
    );
  }
}

class MapBottomSheet extends StatelessWidget {
  final double latitude;
  final double longitude;

  MapBottomSheet({required this.latitude, required this.longitude});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.5, // Adjust the height as needed
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
    );
  }
}
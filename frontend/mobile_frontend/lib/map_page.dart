import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'api_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class MapPage extends StatefulWidget {
  @override
  _MapPageState createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  MapController _mapController = MapController();
  List<Marker> _markers = [];
  String _selectedAnimal = ''; 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Row(
          children: [
            Text('Filters'),
            IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: () {
              _showFilterOptions();
            },
          ),
          ],
        ),
      ),
      body: Stack(
        children: [
          FlutterMap(
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
    );
  }

  // Display filter options in a modal bottom sheet
  void _showFilterOptions() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Filter Options", style: TextStyle(fontSize: 18.0)),
              DropdownButton<String>(
                hint: Text("Select Animal Type"),
                value: _selectedAnimal.isEmpty ? null : _selectedAnimal,
                items: <String>['Cat', 'Racoon', 'Turtle', 'Other'].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedAnimal = newValue ?? '';
                  });
                },
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  _applyFilters();
                },
                child: Text("Apply"),
              ),
            ],
          ),
        );
      },
    );
  }

  // Fetch filtered results and update markers
  Future<void> _applyFilters() async {
    List<dynamic> posts = await ApiService.fetchFilteredPosts(_selectedAnimal);

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
            child: Icon(Icons.location_on, color: Colors.red, size: 40),
          ),
        );
      }).toList();
    });
  }

  // Show details in a bottom sheet when a marker is tapped
  void _showDetailsBottomSheet(Map<String, dynamic> post) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(16.0),
          color: Colors.white,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Details", style: TextStyle(fontSize: 18.0)),
              SizedBox(height: 10),
              Text("Animal: ${post['animal']}"),
              Text("Description: ${post['description']}"),
              Text("Posted by: ${post['username']}"),
              if (post['photo'] != null)
                CachedNetworkImage(
                  imageUrl: post['photo'],
                  placeholder: (context, url) => SpinKitCircle(color: Colors.blue),
                  errorWidget: (context, url, error) => Icon(Icons.error),
                ),
            ],
          ),
        );
      },
    );
  }


  void _hideDetailsBottomSheet() {
    if (Navigator.canPop(context)) {
      Navigator.of(context).pop();
    }
  }
}
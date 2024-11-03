import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class CreatePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Dropdown for Animal Type
          Text('Animal Type:', style: TextStyle(fontSize: 16)),
          DropdownButtonFormField<String>(
            items: <String>['Cat', 'Racoon', 'Deer', 'Bird', 'Mammal', 'Reptile', 'Amphibian']
                .map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onChanged: (_) {},
            decoration: InputDecoration(border: OutlineInputBorder()),
          ),
          SizedBox(height: 16),

          // Text Box for Description
          Text('Description:', style: TextStyle(fontSize: 16)),
          TextField(
            maxLines: 4,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              hintText: 'Describe the animal and its behavior...',
            ),
          ),
          SizedBox(height: 16),

          // Image Upload Button
          ElevatedButton.icon(
            onPressed: () {
              // Add functionality to upload image
            },
            icon: Icon(Icons.photo_camera),
            label: Text('Upload Picture'),
          ),
          SizedBox(height: 16),

          // Location Picker
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: () {
                  // Use current location
                },
                child: Text('Use Current Location'),
              ),
              ElevatedButton(
                onPressed: () {
                  _showMapModal(context); // Show map on button press
                },
                child: Text('Pick on Map'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showMapModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          height: 400, // Adjust height as needed
          child: GoogleMapPicker(),
        );
      },
    );
  }
}

class GoogleMapPicker extends StatefulWidget {
  @override
  _GoogleMapPickerState createState() => _GoogleMapPickerState();
}

class _GoogleMapPickerState extends State<GoogleMapPicker> {
  late GoogleMapController mapController;

  final LatLng _initialPosition = const LatLng(28.60221, -81.20031); // Set initial map center

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(
              target: _initialPosition,
              zoom: 15.0,
            ),
            // Add other map settings as needed
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton(
              child: Icon(Icons.check),
              onPressed: () {
                // Code to get selected location or confirm selection
                Navigator.pop(context); // Close the modal
              },
            ),
          ),
        ],
      ),
    );
  }
}

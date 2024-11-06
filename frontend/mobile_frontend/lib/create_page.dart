import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'api_service.dart';
import 'package:geolocator/geolocator.dart';


final apiService = ApiService();

class CreatePage extends StatefulWidget {
  @override
  State<CreatePage> createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  File? _image;
  String? _animalType;
  String? _description;
  LatLng? _selectedCoordinates;

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    try {
      final pickedFile = await picker.pickImage(source: source);
    
      if (pickedFile != null) {
        setState(() {
          _image = File(pickedFile.path);
        });
      }
    } catch (e) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Error"),
          content: Text("Unable to access the camera."),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  Future<void> _submitData() async {
    try {
      await apiService.sendAnimalData(
        animalType: _animalType!,
        description: _description!,
        imageUrl: imageUrl,
        latitude: _selectedCoordinates!.latitude,
        longitude: _selectedCoordinates!.longitude,
      );

      print("Data submitted successfully!");

    } catch (e) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Submission Error"),
          content: Text("There was an issue submitting your data."),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      print("Location services are disabled.");
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.deniedForever) {
      print("Location permission is permanently denied.");
      return;
    }

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission != LocationPermission.whileInUse && permission != LocationPermission.always) {
        print("Location permission denied");
        return;
      }
    }

    Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    setState(() {
      _selectedCoordinates = LatLng(position.latitude, position.longitude);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Animal Type:', style: TextStyle(fontSize: 16)),
          DropdownButtonFormField<String>(
            items: <String>['Cat', 'Racoon', 'Deer', 'Bird', 'Mammal', 'Reptile', 'Amphibian']
                .map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _animalType = value;
              });
            },
            decoration: InputDecoration(border: OutlineInputBorder()),
          ),
          SizedBox(height: 16),

          Text('Description:', style: TextStyle(fontSize: 16)),
          TextField(
            maxLines: 4,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              hintText: 'Description...',
            ),
            onChanged: (value) {
              _description = value;
            },
          ),
          SizedBox(height: 16),

          ElevatedButton.icon(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: Text("Upload Image"),
                    content: Text("Choose a source"),
                    actions: [
                      TextButton(
                        child: Text("Camera"),
                        onPressed: () {
                          _pickImage(ImageSource.camera);
                          Navigator.of(context).pop();
                        },
                      ),
                      TextButton(
                        child: Text("Gallery"),
                        onPressed: () {
                          _pickImage(ImageSource.gallery);
                          Navigator.of(context).pop();
                        },
                      ),
                    ],
                  );
                },
              );
            },
            icon: Icon(Icons.photo_camera),
            label: Text('Upload Picture'),
          ),
          SizedBox(height: 16),

          if (_image != null)...[
            Image.file(_image!, height: 150),
            SizedBox(height: 16),
          ],

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: _getCurrentLocation,
                child: Text('Use Current Location'),
              ),
              ElevatedButton(
                onPressed: () {
                  _showMapModal(context);
                },
                child: Text('Pick on Map'),
              ),
            ],
          ),
          SizedBox(height: 16),

          ElevatedButton(
            onPressed: _submitData,
            child: Text('Submit'),
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
          height: 400,
          child: GoogleMapPicker(onLocationSelected: (LatLng coordinates) {
            setState(() {
              _selectedCoordinates = coordinates;
            });
            Navigator.pop(context);
          }),
        );
      },
    );
  }
}

class GoogleMapPicker extends StatefulWidget {
  final Function(LatLng) onLocationSelected;

  GoogleMapPicker({required this.onLocationSelected});

  @override
  _GoogleMapPickerState createState() => _GoogleMapPickerState();
}

class _GoogleMapPickerState extends State<GoogleMapPicker> {
  late GoogleMapController mapController;
  final LatLng _initialPosition = const LatLng(28.60221, -81.20031);

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
            onTap: (LatLng location) {
              widget.onLocationSelected(location);
              Navigator.pop(context);
            },
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton(
              child: Icon(Icons.check),
              onPressed: () {
                widget.onLocationSelected(_initialPosition);
                Navigator.pop(context);
              },
            ),
          ),
        ],
      ),
    );
  }
}

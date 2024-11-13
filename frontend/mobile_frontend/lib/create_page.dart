import 'package:flutter/material.dart';
//import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';
//import 'package:mobile_frontend/main.dart';
import 'dart:io';
import 'dart:convert';
import 'api_service.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

final apiService = ApiService();

class CreatePage extends StatefulWidget {
  @override
  State<CreatePage> createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  bool _isLoading = false;
  String _message = '';
  String? _animalType;
  String? _description;
  LatLng? _selectedCoordinates;
  String? _base64Image;
  TextEditingController _descriptionController = TextEditingController(); // Clear the description text field

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    try {
      final XFile? pickedFile = await picker.pickImage(source: source);

      if (pickedFile != null) {
        setState(() {
          File(pickedFile.path);
        });
        await _convertImageToBase64(pickedFile);
      }
    } catch (e) {
      _showErrorDialog("Unable to access the camera.");
    }
  }

  Future<void> _convertImageToBase64(XFile pickedFile) async {
    final bytes = await pickedFile.readAsBytes();

    final mimeType = lookupMimeType(pickedFile.path);
    if (mimeType != null) {
      setState(() {
        _base64Image = 'data:$mimeType;base64,${base64Encode(bytes)}';
      });
    } else {
      setState(() {
        _base64Image = 'data:image/jpeg;base64,${base64Encode(bytes)}'; // Default to JPEG
      });
    }
  }

  Future<void> _submitData() async {
    if (_animalType == null || _description == null || _selectedCoordinates == null) {
      _showErrorDialog("Please complete all fields before submitting.");
      return;
    }

    setState(() {
      _isLoading = true;
      _message = '';
    });

    try {
      final base64Image = _base64Image;

      // Send data to API
      await apiService.sendAnimalData(
        animalType: _animalType!,
        description: _description!,
        photo: base64Image!,
        latitude: _selectedCoordinates!.latitude,
        longitude: _selectedCoordinates!.longitude,
      );

      // Successful submission
      setState(() {
        _message = 'Post created successfully';
        // Clear all fields after successful submission
        _animalType = null;
        _description = null;
        _selectedCoordinates = null;
        _base64Image = null;
        _descriptionController.clear(); // Clear the description text field
      });

      // Show success message
      _showSuccessDialog(_message);
    } catch (e) {
      _showErrorDialog("There was an issue submitting your data.");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _getCurrentLocation() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      _showErrorDialog("Location services are disabled.");
      return;
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.deniedForever) {
      _showErrorDialog("Location permission is permanently denied.");
      return;
    }

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.deniedForever || permission == LocationPermission.denied) {
        _showErrorDialog("Location permission denied.");
        return;
      }
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
      ),
    );
    setState(() {
      _selectedCoordinates = LatLng(position.latitude, position.longitude);
    });
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Error"),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text("OK"),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Success"),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text("OK"),
          ),
        ],
      ),
    );
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
            value: _animalType,
            items: <String>['Cat', 'Racoon', 'Deer', 'Bird', 'Mammal', 'Reptile', 'Amphibian']
                .map((String value) => DropdownMenuItem<String>(value: value, child: Text(value)))
                .toList(),
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
            controller: _descriptionController,
            maxLines: 4,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              hintText: 'Description...',
            ),
            onChanged: (value) => _description = value,
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

          if (_base64Image != null)
            Image.memory(
              base64Decode(_base64Image!.replaceFirst(RegExp(r'^data:image/\w+;base64,'), '')),
              height: 150,
            ),

          SizedBox(height: 16),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: _getCurrentLocation,
                child: Text('Use Current Location'),
              ),
              ElevatedButton(
                onPressed: () => _showMapModal(context),
                child: Text('Pick on Map'),
              ),
            ],
          ),
          SizedBox(height: 16),

          _isLoading ? Center(child: CircularProgressIndicator(),) : ElevatedButton(
              onPressed: () async { 
                await _submitData();

                //update selected index and return user to post page
              },
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
        return SizedBox(
          height: 400,
          child: MapPicker(onLocationSelected: (LatLng coordinates) {
            setState(() => _selectedCoordinates = coordinates);
            Navigator.pop(context);
          }),
        );
      },
    );
  }
}


class MapPicker extends StatefulWidget {
  final Function(LatLng) onLocationSelected;

  MapPicker({required this.onLocationSelected});

  @override
  MapPickerState createState() => MapPickerState();
}

class MapPickerState extends State<MapPicker> {
  final LatLng _initialPosition = const LatLng(28.60221, -81.20031);
  late LatLng _selectedPosition;

  @override
  void initState()  {
    super.initState();
    _selectedPosition = _initialPosition;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: MapController(),
            options: MapOptions(
              initialCenter: _initialPosition,
              initialZoom: 15.0,
              onTap: (tapPosition, point) {
                setState(() {
                  _selectedPosition = LatLng(point.latitude, point.longitude);
                });
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _selectedPosition,
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
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton(
              child: Icon(Icons.check),
              onPressed: () {
                print('Updating _selectedPosition and navigating back...');
                if (mounted) {
                  setState(() {
                    widget.onLocationSelected(_selectedPosition);
                  });
                  Future.delayed(Duration(milliseconds: 300), () {
                    // ignore: use_build_context_synchronously
                    if (mounted) Navigator.pop(context);
                  });
                }
              }
            ),
          ),
        ],
      ),
    );
  }
}

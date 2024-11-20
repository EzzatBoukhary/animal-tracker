// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';
import 'dart:io';
import 'dart:convert';
import 'api_service.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'dart:typed_data';
//import 'package:flutter_map_cancellable_tile_provider/flutter_map_cancellable_tile_provider.dart';

final apiService = ApiService();

class CreatePage extends StatefulWidget {
  const CreatePage({super.key});

  @override
  State<CreatePage> createState() => _CreatePageState();
}

class _CreatePageState extends State<CreatePage> {
  final MapController _mapController = MapController();
  final LatLng _initialPosition = const LatLng(28.60221, -81.20031);
  bool _isLoading = false;
  String _message = '';
  String? _animalType;
  String? _description;
  LatLng? _selectedCoordinates;
  String? _base64Image;
  bool _showValidationError = true;
  final TextEditingController _descriptionController = TextEditingController(); // Clear the description text field

  void onLocationSelected(LatLng coordinates) {
    setState(() {
      _selectedCoordinates = coordinates;
    });

    _mapController.move(coordinates, 14); // Optional: To move the map to the selected location
    // print("Updated Coordinates: $_selectedCoordinates");
  }

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

  Uint8List? _decodeImage(String? base64Image) {
    if (base64Image == null) return null;
    return base64Decode(base64Image.replaceFirst(RegExp(r'^data:image/\w+;base64,'), ''));
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
    if (_animalType == null || _description == null || _selectedCoordinates == null || _base64Image == null) {
      setState(() {
        _showValidationError = true; // Show validation error
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _showValidationError = false; // Hide validation error if all fields are valid
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
    return Container(
      decoration: BoxDecoration(
        color: Colors.black,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            //Image handeling
            Center(
              child: GestureDetector(
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(16.0),
                      ),
                    ),
                    backgroundColor: Colors.transparent, // Makes the background transparent so we can use a custom color
                    builder: (BuildContext context) {
                      return ConstrainedBox(
                        constraints: BoxConstraints(maxHeight: 150),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white, // Change this to your desired color
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(16.0),
                            ),
                          ),
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              Column(
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFFC904),
                                      shape: BoxShape.circle,
                                    ),
                                    child: IconButton(
                                      onPressed: () {
                                        _pickImage(ImageSource.gallery);
                                        Navigator.of(context).pop();
                                      },
                                      icon: Icon(
                                        Icons.photo_library, 
                                        size: 40, 
                                      ),
                                      tooltip: 'Gallery', // Tooltip for accessibility
                                    ),
                                  ),
                                  Text(
                                    'UPLOAD',
                                    style: TextStyle(
                                      fontFamily: 'Koulen',
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    'IMAGE',
                                    style: TextStyle(
                                      fontFamily: 'Koulen',
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),                              
                                  ),
                                ],
                              ),
                              Column(
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFFC904),
                                      shape: BoxShape.circle,
                                    ),
                                    child: IconButton(
                                      onPressed: () {
                                        _pickImage(ImageSource.camera);
                                        Navigator.of(context).pop();
                                      },
                                      icon: Icon(
                                        Icons.photo_camera, 
                                        size: 40, 
                                      ),
                                      tooltip: 'Camera', // Tooltip for accessibility
                                    ),
                                  ),
                                  Text(
                                    'CAPTURE',
                                    style: TextStyle(
                                      fontFamily: 'Koulen',
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),  
                                  ),
                                  Text(
                                    'IMAGE',
                                    style: TextStyle(
                                      fontFamily: 'Koulen',
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),  
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
                child: Container(
                  height: 200,
                  width: 200,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(color: Colors.grey),
                    image: _base64Image != null
                        ? DecorationImage(
                            image: MemoryImage(_decodeImage(_base64Image)!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: _base64Image == null ? Icon(
                    Icons.create_rounded,
                      color: Colors.grey,
                      size: 50.0,
                    )
                    : Align(
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.edit,
                        color: Colors.white.withOpacity(0.7),
                        size: 40.0,
                      ),
                    ),
                  ),
                ),
            ),
            SizedBox(height: 16),
      
            //animal drop down selection
            //Text('Animal Type:', style: TextStyle(fontSize: 16)),
            Center(
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.8,
                child: DropdownButtonFormField<String>(
                  value: _animalType,
                  hint: Text('Select Your Animal...'),
                  items: <String>['Cat', 'Racoon', 'Deer', 'Bird', 'Mammal', 'Reptile', 'Amphibian']
                      .map((String value) => DropdownMenuItem<String>(
                        value: value, 
                        child: Text(value)
                      ))
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      _animalType = value;
                    });
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(60),
                    ),
                    filled: true,
                    fillColor: Colors.white,// Set the background color
                  ),
                  dropdownColor: Colors.white,
                  isExpanded: false,
                ),
              ),
            ),
            SizedBox(height: 16),
      
            //location selection
            Center(
              child: SizedBox(
                width:MediaQuery.of(context).size.width * 0.8,
                child: ElevatedButton(
                  onPressed: () {
                    // Show the bottom sheet with the two buttons
                    showModalBottomSheet(
                      context: context,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.vertical(
                          top: Radius.circular(16.0),
                        ),
                      ),
                      backgroundColor: Colors.transparent, // Makes the background transparent for customization
                      builder: (BuildContext context) {
                        return Container(
                          decoration: BoxDecoration(
                            color: Colors.white, // Background color for the bottom sheet
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(16.0),
                            ),
                          ),
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min, // To fit the content's height
                            children: [
                              SizedBox(height: 16.0),
                              ElevatedButton(
                                onPressed: () {
                                  _getCurrentLocation();
                                  Navigator.pop(context);
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFFFC904),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.location_on,
                                      color: Colors.black,
                                    ),
                                    SizedBox(width: 8.0),
                                    Text(
                                      'Use My Location',
                                      style: TextStyle(
                                        fontFamily: 'Kreon',
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 16.0), // Adds space between the buttons
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  _showMapModal(context);
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFFFC904),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.map_outlined,
                                      color: Colors.black,
                                    ),
                                    SizedBox(width: 8.0),
                                    Text(
                                      'Select From Map',
                                      style: TextStyle(
                                        fontFamily: 'Kreon',
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 16.0),
                            ],
                          ),
                        );
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                  ),
                  child: Text(
                    'Select Your Location',
                    style: 
                      TextStyle(
                        color: Colors.black,
                        fontFamily: 'Kreon',
                        fontWeight: FontWeight.w400,
                      ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 16),
      
            Center(
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.8,
                child: TextField(
                  controller: _descriptionController,
                  maxLines: 4,
                  maxLength: 150,
                  buildCounter: (context, {required currentLength, required isFocused, maxLength}) {
                      return Container(
                        transform: Matrix4.translationValues(0, -30, 0),
                        child: Text(
                          "$currentLength/$maxLength",
                          style: TextStyle(color: Colors.black),
                        ),
                      );
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    hintText: 'Enter Animal Description...',
                    filled: true,  // Enable background color
                    fillColor: Colors.white, 
              
                  ),
                  onChanged: (value) => _description = value,
                ),
              ),
            ),
            SizedBox(height: 16),

            //SUBMIT BUTTON
            Center(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                ),
                width: MediaQuery.of(context).size.width * 0.8,
                padding: EdgeInsets.all(3),
                child: _isLoading 
                  ? CircularProgressIndicator() 
                  : ElevatedButton(
                    onPressed: () async { 
                      await _submitData();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFC904),
                      padding: EdgeInsets.all(10),
                    ),
                  child: Text(
                    'Submit',
                    style: TextStyle(
                      fontFamily: 'Kreon',
                      fontSize: 30,
                      fontWeight: FontWeight.w700,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
            ),
            
            SizedBox(height: 16),
            if (_showValidationError) // Show validation message
              Center(
                child: Text(
                  '***A photo, location, and description must be selected***',
                  style: TextStyle(color: Colors.red, fontSize: 14),
                ),
              ),
            SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _showMapModal(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    double bottomSheetHeight = screenHeight * 0.8;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(20),
            ),
          ),
          
          height: bottomSheetHeight,
          child: Column(
            children: [
              SizedBox(height: 16,),
              Center(
                child: Text(
                  'Tap to Drop a Pin',
                  style: TextStyle(
                    fontFamily: 'Kreon',
                    fontSize: 20,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
              SizedBox(height: 4,),
              //map container
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: Colors.black,
                ),
                padding: EdgeInsets.all(3),
                width: MediaQuery.of(context).size.width * 0.8,
                height: bottomSheetHeight * .8,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20.0),
                  child: FlutterMap(
                    key: ValueKey(_selectedCoordinates),
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: _initialPosition,
                      initialZoom: 15.0,
                      onTap: (_, latlng) {
                        onLocationSelected(latlng);
                        _mapController.move(latlng, 15.0);
                      },
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      ),
                      MarkerLayer(
                        markers: [
                          if (_selectedCoordinates != null)
                            Marker(
                              width: 40,
                              height: 40,
                              point: _selectedCoordinates!,
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
              SizedBox(height: 8,),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  padding: EdgeInsets.all(1),
                  width: MediaQuery.of(context).size.width * 0.8,
                  child: ElevatedButton(
                    onPressed: () {
                      // print('Updating _selectedCoordinates and navigating back..');
                      if(mounted){
                        setState(() {
                          onLocationSelected(_selectedCoordinates!);
                        });
                        Future.delayed(Duration(milliseconds: 300), (){
                          if (mounted) Navigator.pop(context);
                        });
                      }
                    }, 
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFC904),
                    ),
                    child: Text(
                      'Confirm',
                      style: TextStyle(
                        fontFamily: 'Kreon',
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}



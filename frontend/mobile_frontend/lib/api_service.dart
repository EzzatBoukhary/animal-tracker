// api_service.dart
import 'dart:convert';
//import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class ApiService {
  final String baseUrl = 'http://localhost:5000/api'; // Use your actual base URL

  //Helper function to load user data from SharedPreferences
  Future<Map<String, String?>> loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('userId');
    final firstName = prefs.getString('firstName');
    final lastName = prefs.getString('lastName');
    return {'userId': userId, 'firstName': firstName, 'lastName': lastName};
  }

  // Registration
  Future<Map<String, dynamic>> register(String login, String password, String email, String firstName, String lastName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'login': login,
        'password': password,
        'email': email,
        'firstName': firstName,
        'lastName': lastName,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body); // Successful registration
    } else {
      throw Exception('Failed to register: ${json.decode(response.body)['message']}');
    }
  }

  // Login
  Future<Map<String, dynamic>> login(String login, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'login': login,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);

      // Store user session data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', data['id'].toString());
      await prefs.setString('firstName', data['firstName']);
      await prefs.setString('lastName', data['lastName']);

      return data; // Successful login
    } else {
      throw Exception('Failed to log in: ${json.decode(response.body)['error']}');
    }
  }

  //Send animal sighting data to MongoDB
  Future<void> sendAnimalData({
    required String animalType,
    required String description,
    required String imageUrl,
    required double latitude,
    required double longitude,
  }) async {
    final userData = await loadUserData();
    final userId = userData['userId'];

    if (userId == null) {
      throw Exception("User is not logged in.");
    }

    final url = Uri.parse("$baseUrl/create");
    
    final data = {
      "userId": userId,
      "location": {"latitude": latitude, "longitude": longitude},
      "photo": imageUrl,
      "description": description,
      "animal": animalType,
      "postedDate": DateTime.now().toIso8601String(), // Add current date as ISO string
    };

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );

    if (response.statusCode != 201) {
      final errorResponse = json.decode(response.body);
      throw Exception("Failed to create post: ${errorResponse['message'] ?? response.statusCode}");
    }
  }
}

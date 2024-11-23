import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  final String baseUrl= 'http://10.0.2.2:5000/api'; //CHANGE THIS BEFORE MOVING TO SERVER!!!
  // http.Client client; //used for testing
  
  // ApiService({String? baseURL = 'http://localhost:5000/api', http.Client? client}) 
  //   : baseUrl = baseURL = 'http://localhost:5000/api',
  //     client = client ?? http.Client();

  // Helper function to load user data from SharedPreferences
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

    // print('Login Response Status: ${response.statusCode}');
    // print('Login Response Body: ${response.body}');

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      // Store user session data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', data['id'].toString());
      await prefs.setString('firstName', data['firstName']);
      await prefs.setString('lastName', data['lastName']);
      return data;
    } else {
      throw Exception('Failed to log in: ${json.decode(response.body)['error']}');
    }
  }

  // Send animal sighting data to MongoDB
  Future<void> sendAnimalData({
    required String animalType,
    required String description,
    required String photo,
    required double latitude,
    required double longitude,
  }) async {
    final location = {
      'latitude': latitude,
      'longitude': longitude,
    };

    try {
      //load user ID
      final userData = await loadUserData();
      final userIdString = userData['userId'];

      // Check if userId is available
      if (userIdString == null) {
        throw Exception('User is not logged in');
      }

      // Convert userId to int
      int userId;
      try {
        userId = int.parse(userIdString);  // Convert to int
      } catch (e) {
        throw Exception('Failed to parse userId to int');
      }

      //do the thing
      final response = await http.post(
        Uri.parse("$baseUrl/create"),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId':userId,
          'animal': animalType,
          'description': description,
          'photo': photo,
          'location': location,
        }),
      );

      // print("Response Status: ${response.statusCode}");
      // print("Response Body: ${response.body}");

      if (response.statusCode != 201 && response.statusCode != 200) {
        throw Exception('Failed to submit data');
      }
    } catch (e) {
      // Print error message for better debugging
      // print("Error in API call: $e");
      rethrow;  // Re-throw the error to handle it in the calling function
    }
  }

  //get all posts (no search involved) from database
  // Future<List<Map<String, dynamic>>> fetchPosts(int page, int limit) async {
  //   final response = await http.get(
  //     Uri.parse('your-api-endpoint?page=$page&limit=$limit'),
  //     headers: {'Content-Type': 'application/json'},
  //   );

  //   if (response.statusCode == 200) {
  //     final data = json.decode(response.body);
  //     final fetchedPosts = data['posts'] as List;

  //     // Decode images and add them to the post objects
  //     List<Map<String, dynamic>> processedPosts = [];
  //     for (var post in fetchedPosts) {
  //       if (post['photo'] != null && post['photo'].startsWith('data:image')) {
  //         final base64String = post['photo'].split(',').last; // Strip prefix
  //         final imageBytes = base64Decode(base64String);

  //         // Add the decoded image to a new field in the post
  //         post['decodedPhoto'] = imageBytes;
  //       }
  //       processedPosts.add(post);
  //     }

  //     return processedPosts;
  //   } else {
  //     throw Exception('Failed to load posts');
  //   }
  // }

  Future<List<dynamic>> fetchPosts(int page, int limit) async {
    final response = await http.get(
      Uri.parse('$baseUrl/getPostsMobile?page=$page&limit=$limit'),
      headers: {'Content-Type': 'application/json'},
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['posts'];
    } else {
      throw Exception('Failed to load posts');
    }
  }

  //search for selected animals
  Future<List<dynamic>> fetchFilteredPosts(String? animal) async {
    final response = await http.get(
      Uri.parse('$baseUrl/searchPosts?animal=$animal'), 
      headers: {'Content-Type': 'application/json'}
    );
    
    try {
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        // print('Failed to load posts: ${response.body}');
        return [];
      }
    } catch (error) {
      // print('Error fetching posts: $error');
      return [];
    }
  }

}

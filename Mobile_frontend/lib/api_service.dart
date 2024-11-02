// api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl = 'http://localhost:5000/api'; // Use your actual base URL

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
      return json.decode(response.body); // Successful login
    } else {
      throw Exception('Failed to log in: ${json.decode(response.body)['error']}');
    }
  }
}

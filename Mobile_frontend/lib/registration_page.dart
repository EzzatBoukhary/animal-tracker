// registration_page.dart
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'api_service.dart';
import 'login_page.dart'; 
import 'main.dart'; // Update this to the correct path where MyAppState is defined

class RegistrationPage extends StatefulWidget {
  @override
  _RegistrationPageState createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final ApiService apiService = ApiService();

  void _handleRegistration() async {
    String username = _usernameController.text;
    String password = _passwordController.text;
    String email = _emailController.text;
    String firstName = _firstNameController.text;
    String lastName = _lastNameController.text;

    try {
      var response = await apiService.register(username, password, email, firstName, lastName);
      
      // Log the entire response for debugging
      print('Response: $response');

      // Check if the response indicates an error
      if (response['error'] != null && response['error'].isNotEmpty) {
        // Show error from the response
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Registration failed: ${response['error']}')),
        );
      } else {
        // Successful registration
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Registration succefull please check Email to confirm')),
        );
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => LoginPage()),
          (Route<dynamic> route) => false,
        );
        
      }
    } catch (e) {
      // Log and show unexpected exceptions
      print('Unexpected error: $e'); // Log the unexpected error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Register'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            TextField(
              controller: _usernameController,
              decoration: InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _firstNameController,
              decoration: InputDecoration(labelText: 'First Name'),
            ),
            TextField(
              controller: _lastNameController,
              decoration: InputDecoration(labelText: 'Last Name'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleRegistration,
              child: Text('Register'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _emailController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    super.dispose();
  }
}

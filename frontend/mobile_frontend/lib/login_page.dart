import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'api_service.dart';
import 'main.dart'; 
import 'registration_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final ApiService apiService = ApiService();

  void _handleLogin() async {
    String username = _usernameController.text;
    String password = _passwordController.text;

    print('Username: $username, Password: $password'); // Log credentials

    try {
      var response = await apiService.login(username, password);
      print('Response: $response'); // Log response data

      if (response.containsKey('error') && (response['error'] == null || response['error'].isEmpty)) {
        print('Login successful');
        Provider.of<MyAppState>(context, listen: false).login();
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => MyHomePage(title: 'UCF Animal Tracker')),
        );
      } else {
        print('Login failed with error: ${response['error']}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${response['error']}')),
        );
      }
    } catch (e) {
      print('Login exception: $e'); // Catch exceptions properly
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred during login: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
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
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleLogin,
              child: Text('Login'),
            ),
            SizedBox(height: 20), // Add space before the link
            TextButton(
              onPressed: () {
                Navigator.of(context).push(MaterialPageRoute(builder: (context) => RegistrationPage()));
              },
              child: Text('Don\'t have an account? Register here.'),
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
    super.dispose();
  }
}

import 'package:appwrite/appwrite.dart';
import 'package:appwrite/models.dart' as models;
import '../services/appwrite_service.dart';

class AuthRepository {
  final _account = AppwriteService.instance.account;

  Future<models.User?> getCurrentUser() async {
    try {
      return await _account.get();
    } catch (_) {
      return null;
    }
  }

  Future<models.User> signup({
    required String email,
    required String password,
    String? name,
  }) async {
    return await _account.create(
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
    );
  }

  Future<models.Session> login({
    required String email,
    required String password,
  }) async {
    return await _account.createEmailPasswordSession(
      email: email,
      password: password,
    );
  }

  Future<void> logout() async {
    await _account.deleteSession(sessionId: 'current');
  }
}

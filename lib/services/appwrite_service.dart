import 'package:appwrite/appwrite.dart';

class AppwriteService {
  AppwriteService._();
  static final AppwriteService instance = AppwriteService._();

  late final Client _client;
  late final Account account;
  late final Databases databases;
  late final Storage storage;

  bool _initialized = false;

  Future<void> init({
    required String endpoint,
    required String projectId,
  }) async {
    if (_initialized) return;

    _client = Client()
      ..setEndpoint(endpoint)
      ..setProject(projectId);

    account = Account(_client);
    databases = Databases(_client);
    storage = Storage(_client);

    _initialized = true;
  }
}

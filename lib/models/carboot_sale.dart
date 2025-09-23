import 'package:equatable/equatable.dart';

class CarBootSale extends Equatable {
  final String id;
  final String name;
  final String location;
  final String address;
  final DateTime date; // next occurrence date
  final String openingTime;
  final String closingTime;
  final double latitude;
  final double longitude;
  final int estimatedSize;
  final List<String> facilities;
  final double rating;
  final int reviewCount;
  final String description;
  final String organiser;
  final String contactEmail;
  final bool isVerified;
  final String? imageUrl; // Optional field for image URL
  final String? website; // Optional field for website URL
  final String? phoneNumber; // Optional field for contact phone number
  final String? socialMedia; // Optional field for social media links
  final List<DateTime>? upcomingDates; // Optional field for multiple upcoming dates

  const CarBootSale({
    required this.id,
    required this.name,
    required this.location,
    required this.address,
    required this.date,
    required this.openingTime,
    required this.closingTime,
    required this.latitude,
    required this.longitude,
    required this.estimatedSize,
    required this.facilities,
    required this.rating,
    required this.reviewCount,
    required this.description,
    required this.organiser,
    required this.contactEmail,
    required this.isVerified,
    this.imageUrl,
    this.website,
    this.phoneNumber,
    this.socialMedia,
    this.upcomingDates,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        location,
        address,
        date,
        openingTime,
        closingTime,
        latitude,
        longitude,
        estimatedSize,
        facilities,
        rating,
        reviewCount,
        description,
        organiser,
        contactEmail,
        isVerified,
        imageUrl,
        website,
        phoneNumber,
        socialMedia,
        upcomingDates,
      ];

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'address': address,
      'date': date.toIso8601String(),
      'openingTime': openingTime,
      'closingTime': closingTime,
      'latitude': latitude,
      'longitude': longitude,
      'estimatedSize': estimatedSize,
      'facilities': facilities,
      'rating': rating,
      'reviewCount': reviewCount,
      'description': description,
      'organiser': organiser,
      'contactEmail': contactEmail,
      'isVerified': isVerified,
      'imageUrl': imageUrl,
      'website': website,
      'phoneNumber': phoneNumber,
      'socialMedia': socialMedia,
      'upcomingDates': upcomingDates?.map((date) => date.toIso8601String()).toList(),
    };
  }

  factory CarBootSale.fromJson(Map<String, dynamic> json) {
    return CarBootSale(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      address: json['address'],
      date: DateTime.parse(json['date']),
      openingTime: json['openingTime'],
      closingTime: json['closingTime'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
      estimatedSize: json['estimatedSize'],
      facilities: List<String>.from(json['facilities']),
      rating: json['rating'].toDouble(),
      reviewCount: json['reviewCount'],
      description: json['description'],
      organiser: json['organiser'],
      contactEmail: json['contactEmail'],
      isVerified: json['isVerified'],
      imageUrl: json['imageUrl'],
      website: json['website'],
      phoneNumber: json['phoneNumber'],
      socialMedia: json['socialMedia'],
      upcomingDates: json['upcomingDates'] != null
          ? List<DateTime>.from(
              (json['upcomingDates'] as List).map((date) => DateTime.parse(date)))
          : null,
    );
  }
}

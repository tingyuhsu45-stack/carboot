import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/carboot_sale.dart';
import '../theme/app_theme.dart';

class DetailScreen extends StatelessWidget {
  final CarBootSale sale;

  const DetailScreen({
    super.key,
    required this.sale,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(sale.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () => _shareEvent(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Image Placeholder (eco-themed gradient)
            Container(
              height: 200,
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: AppTheme.ecoGradient,
              ),
              child: const Center(
                child: Icon(
                  Icons.storefront,
                  size: 64,
                  color: Colors.white,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Verified Badge
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          sale.name,
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      if (sale.isVerified)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.verifiedBadge,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.verified,
                                size: 16,
                                color: Colors.white,
                              ),
                              SizedBox(width: 6),
                              Text(
                                'Verified Organiser',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Rating
                  Row(
                    children: [
                      ...List.generate(5, (index) {
                        return Icon(
                          index < sale.rating.floor()
                              ? Icons.star
                              : index < sale.rating
                                  ? Icons.star_half
                                  : Icons.star_border,
                          color: AppTheme.ratingStars,
                          size: 24,
                        );
                      }),
                      const SizedBox(width: 8),
                      Text(
                        '${sale.rating.toStringAsFixed(1)} (${sale.reviewCount} reviews)',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Quick Info Cards
                  Row(
                    children: [
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.calendar_today,
                          title: 'Date',
                          value: DateFormat('EEE, MMM d, yyyy').format(sale.date),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.access_time,
                          title: 'Hours',
                          value: '${sale.openingTime} - ${sale.closingTime}',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.store,
                          title: 'Est. Size',
                          value: '${sale.estimatedSize} stalls',
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.location_city,
                          title: 'Area',
                          value: sale.location,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Description
                  _SectionHeader(title: 'About this Car Boot Sale'),
                  const SizedBox(height: 8),
                  Text(
                    sale.description,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 24),

                  // Location
                  _SectionHeader(title: 'Location'),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.lightGrey,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.accentGreen.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.location_on,
                          color: AppTheme.primaryGreen,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            sale.address,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Facilities
                  if (sale.facilities.isNotEmpty) ...[
                    _SectionHeader(title: 'Facilities & Amenities'),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: sale.facilities.map((facility) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.facilityIcon.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: AppTheme.facilityIcon.withOpacity(0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _getFacilityIcon(facility),
                                size: 16,
                                color: AppTheme.facilityIcon,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                facility,
                                style: const TextStyle(
                                  color: AppTheme.facilityIcon,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Organiser Information
                  _SectionHeader(title: 'Organiser'),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.accentGreen.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: const BoxDecoration(
                            color: AppTheme.primaryGreen,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.person,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                sale.organiser,
                                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                sale.contactEmail,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: AppTheme.neutralGrey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Eco Message
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: AppTheme.ecoGradient.scale(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.eco,
                          color: AppTheme.primaryGreen,
                          size: 32,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Give Items a New Life! 🌱',
                                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryGreen,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Help reduce waste and find unique treasures at car boot sales. Every purchase helps the environment!',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: AppTheme.earthBrown,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _getDirections(context),
        label: const Text('Get Directions'),
        icon: const Icon(Icons.directions),
      ),
    );
  }

  void _shareEvent(BuildContext context) {
    // In a real app, you would implement sharing functionality here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Share functionality would be implemented here'),
      ),
    );
  }

  void _getDirections(BuildContext context) async {
    final Uri googleMapsUri = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${Uri.encodeComponent(sale.address)}',
    );
    final Uri appleMapsUri = Uri.parse(
      'http://maps.apple.com/?daddr=${Uri.encodeComponent(sale.address)}',
    );

    try {
      // Try to launch Google Maps first, fallback to Apple Maps on iOS
      if (Theme.of(context).platform == TargetPlatform.iOS) {
        await _launchUrl(appleMapsUri, context);
      } else {
        await _launchUrl(googleMapsUri, context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not open maps: $e'),
        ),
      );
    }
  }

  Future<void> _launchUrl(Uri uri, BuildContext context) async {
    // You need to add url_launcher to your pubspec.yaml
    // import 'package:url_launcher/url_launcher.dart';
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch $uri';
    }
  }

  IconData _getFacilityIcon(String facility) {
    switch (facility.toLowerCase()) {
      case 'toilets':
        return Icons.wc;
      case 'food':
        return Icons.restaurant;
      case 'parking':
        return Icons.local_parking;
      case 'atm':
        return Icons.atm;
      case 'disabled access':
        return Icons.accessible;
      default:
        return Icons.check_circle;
    }
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _InfoCard({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.accentGreen.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: AppTheme.primaryGreen,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: AppTheme.neutralGrey,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.bold,
        color: AppTheme.primaryGreen,
      ),
    );
  }
}

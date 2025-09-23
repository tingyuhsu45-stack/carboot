import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/carboot_sale.dart';
import '../theme/app_theme.dart';

class CarBootCard extends StatelessWidget {
  final CarBootSale sale;
  final VoidCallback? onTap;

  const CarBootCard({
    super.key,
    required this.sale,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with name and verified badge
              Row(
                children: [
                  Expanded(
                    child: Text(
                      sale.name,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (sale.isVerified)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.verifiedBadge,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.verified,
                            size: 14,
                            color: Colors.white,
                          ),
                          SizedBox(width: 4),
                          Text(
                            'Verified',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),

              // Location and address
              Row(
                children: [
                  const Icon(
                    Icons.location_on,
                    size: 16,
                    color: AppTheme.primaryGreen,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '${sale.location} • ${sale.address}',
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Date and time
              Row(
                children: [
                  const Icon(
                    Icons.access_time,
                    size: 16,
                    color: AppTheme.primaryGreen,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${DateFormat('EEE, MMM d').format(sale.date)} • ${sale.openingTime} - ${sale.closingTime}',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Size and rating
              Row(
                children: [
                  // Size
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGreen.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${sale.estimatedSize} stalls',
                      style: const TextStyle(
                        color: AppTheme.primaryGreen,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Rating
                  Row(
                    children: [
                      const Icon(
                        Icons.star,
                        size: 16,
                        color: AppTheme.ratingStars,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        '${sale.rating.toStringAsFixed(1)} (${sale.reviewCount})',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const Spacer(),

                  // Arrow indicator
                  const Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: AppTheme.neutralGrey,
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Facilities
              if (sale.facilities.isNotEmpty)
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: sale.facilities.take(3).map((facility) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.facilityIcon.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        facility,
                        style: const TextStyle(
                          color: AppTheme.facilityIcon,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    );
                  }).toList(),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

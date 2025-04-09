<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\Question;
use Illuminate\Support\Facades\Log;

class ItemSelectionService
{
    public function calculateProbability(float $theta, float $a, float $b): float
    {
        try {
            $exponent = -$a * ($theta - $b);
            $probability = 1 / (1 + exp($exponent));


            return $probability;
        } catch (\Exception $e) {
            Log::error('Error in calculateProbability: ' . $e->getMessage());
            return 0.0;
        }
    }

    public function calculateFisherInformation(float $theta, float $a, float $b): float
    {
        // P(θ)
        $pTheta = $this->calculateProbability($theta, $a, $b);

        // Fisher Information I(θ)
        $fisherInformation = pow($a, 2) * $pTheta * (1 - $pTheta);

        Log::debug('Probability calculated', [
            'a' => $a,
            'b' => $b,
            'theta' => $theta,
            'P(θ)' => $pTheta,
            'fisher' => $fisherInformation
        ]);

        return $fisherInformation;

    }

    public function getMaximumItem(float $theta, array $items): ?array
    {
        try {
            $maxFisherInfo = -INF;
            $maxItem = null;

            // Calculate Fisher Information and track maximum in a single pass
            foreach ($items as $item) {
                $a = $item['a'] ?? 1.0;
                $b = $item['b'] ?? 0.0;

                $fisherInfo = $this->calculateFisherInformation($theta, $a, $b);

                // Update maximum if current Fisher info is higher
                if ($fisherInfo > $maxFisherInfo) {
                    $maxFisherInfo = $fisherInfo;
                    $maxItem = $item;
                }
            }

            if ($maxItem) {
                Log::debug('Item with maximum Fisher Information selected', [
                    'max_fisher_info' => $maxFisherInfo,
                    'b (difficulty)' => $maxItem['b'],
                    'a (discrimination)' => $maxItem['a'],
                    'theta' => $theta,
                ]);
            }

            return $maxItem;
        } catch (\Exception $e) {
            Log::error('Error in getMaximumItem: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Selects the item with the maximum Fisher Information for a specific course.
     */
    public function getMaximumItemByCourse(float $theta, int $course, array $items): ?array
    {
        try {
            // Filter items by the given course
            $filteredItems = array_filter($items, function ($item) use ($course) {
                return $item['course'] === $course;
            });

            // If no items for the course, return null
            if (empty($filteredItems)) {
                Log::warning('No items found for course', ['course' => $course]);
                return null;
            }

            $maximumCourseItem = $this->getMaximumItem($theta, $filteredItems);

            return $maximumCourseItem;
        } catch (\Exception $e) {
            Log::error('Error in getMaximumItemByCourse: ' . $e->getMessage());
            return null;
        }
    }

    public function calculateStandardError(float $theta, array $items): float
    {
        try {
            // Calculate total Fisher information
            $totalInformation = array_sum(array_map(function ($item) use ($theta) {
                return $this->calculateFisherInformation($theta, $item['a'], $item['b']);
            }, $items));

            $sem = 1 / sqrt($totalInformation);

            return $sem;

        } catch (\Exception $e) {
            Log::error('Error in calculateStandardError: ' . $e->getMessage());
            return INF;
        }
    }

}

<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\Question;
use Illuminate\Support\Facades\Log;

class ItemSelectionService

{
    /**
     * THis function calculates the probability of a correct response for an item using the 2-parameter logistic model (2PL).
     *
     * Formula: P(θ) = 1 / (1 + e^(-a(θ - b)))
     *
     * @param float $theta The examinee's ability level.
     * @param float $a The item's discrimination parameter.
     * @param float $b The item's difficulty parameter.
     * @return float The probability of a correct response.
     */
    public function calculateProbability(float $theta, float $a, float $b): float
    {
        try {
            $exponent = -$a * ($theta - $b);
            $probability = 1 / (1 + exp($exponent));
            Log::debug('Probability calculated', [
                'theta' => $theta,
                'a' => $a,
                'b' => $b,
                'P(θ)' => $probability,
            ]);

            return $probability;
        } catch (\Exception $e) {
            Log::error('Error in calculateProbability: ' . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Calculates the Fisher Information for an item.
     *
     * Formula: I(θ) = [P'(θ)]^2 / (P(θ)(1 - P(θ)))
     *
     * @param float $theta The examinee's ability level.
     * @param float $a The item's discrimination parameter.
     * @param float $b The item's difficulty parameter.
     * @return float The Fisher Information for the item.
     */
    public function calculateFisherInformation(float $theta, float $a, float $b): float
    {
        try {
            // P(θ)
            $pTheta = $this->calculateProbability($theta, $a, $b);

            // First derivative of P(θ), P'(θ) = a * P(θ) * (1 - P(θ))
            $pThetaDerivative = $a * $pTheta * (1 - $pTheta);

            // Fisher Information I(θ)
            $fisherInformation = pow($pThetaDerivative, 2) / ($pTheta * (1 - $pTheta));

            Log::debug('Fisher Information calculated', [
                'theta' => $theta,
                'a' => $a,
                'b' => $b,
                'I(θ)' => $fisherInformation,
            ]);

            return $fisherInformation;
        } catch (\Exception $e) {
            Log::error('Error in calculateFisherInformation: ' . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Calculates Fisher Information for all items and selects the item with the maximum value.
     *
     * @param float $theta The examinee's ability level.
     * @param array $items An array of items, where each item is an associative array with 'a' and 'b' parameters.
     *                     Example: [['id' => 1, 'a' => 1.2, 'b' => 0.5], ['id' => 2, 'a' => 0.9, 'b' => 1.1]]
     * @return array|null The selected item with the maximum Fisher Information.
     */
    public function getMaximumItem(float $theta, array $items): ?array
    {
        try {
            $fisherInfoResults = [];

            // Step 1: Calculate Fisher Information for all items
            foreach ($items as $item) {
                $a = $item['a'] ?? 1.0; // Default discrimination
                $b = $item['b'] ?? 0.0; // Default difficulty

                $fisherInfo = $this->calculateFisherInformation($theta, $a, $b);

                // Store the item with its Fisher Information
                $fisherInfoResults[] = [
                    'item' => $item,
                    'fisher_information' => $fisherInfo,
                ];
            }

            // Step 2: Select the item with the maximum Fisher Information
            $selectedItem = collect($fisherInfoResults)->sortByDesc('fisher_information')->first();

            Log::debug('Item with maximum Fisher Information selected', [
                'theta' => $theta,
                'selected_item' => $selectedItem['item'] ?? null,
                'max_fisher_info' => $selectedItem['fisher_information'] ?? null,
            ]);

            return $selectedItem['item'] ?? null;
        } catch (\Exception $e) {
            Log::error('Error in getMaximumItem: ' . $e->getMessage());
            return null;
        }
    }
    
}
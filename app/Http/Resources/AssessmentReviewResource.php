<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_course_id' => $this->assessment_course_id,
            'total_score' => $this->total_score,
            'total_items' => $this->total_items,
            'percentage' => $this->percentage,
            'initial_theta_score' => number_format($this->initial_theta_score, 2),
            'final_theta_score' => number_format($this->final_theta_score, 2),
            'course_id' => $this->course_id,
            'course' => new CourseResource($this->course),
            'assessment_items' => $this->assessment_items->map(function ($item) {
                return [
                    'assessment_id' => $item->assessment_item_id,
                    'score' => $item->score,
                    'participants_answer' => json_decode($item->participants_answer),
                    'question' => [
                        'question_id' => $item->question->question_id,
                        'question' => $item->question->question,
                        'choices' => json_decode($item->question->question_detail->choices),
                        'type' => $item->question->question_detail->type,
                        'answer' => json_decode($item->question->question_detail->answer),
                    ]
                ];
            })
        ];
    }
}

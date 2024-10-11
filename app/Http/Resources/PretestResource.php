<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PretestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'pretest_id' => $this->pretest_id,
            'student_id' => $this->student_id,
            'totalItems' => $this->totalItems,
            'totalScore' => $this->totalScore,
            'percentage' => $this->percentage,
            'status' => $this->status,
            'courses' => $this->whenLoaded('pretest_courses', function () {
                return $this->pretest_courses->map(function ($course) {
                    return [
                        'course_id' => $course->course_id,
                        'title' => $course->courses->title,
                        'theta_score' => $course->theta_score,
                        'questions' => $course->pretest_answers->map(function ($answer) {
                            return [
                                'question_id' => $answer->pretest_question->questions->question_id,
                                'question' => $answer->pretest_question->questions->question,
                                'participants_answer' => json_decode($answer->participants_answer),
                                'score' => $answer->score,
                            ];
                        }),
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

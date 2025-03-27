<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'question_id' => $this->question_id,
            'course_id' => $this->course_id,
            'test_type' => $this->test_type,
            'question' => $this->question,
            'discrimination_index' => $this->discrimination_index,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('F j, Y '), 
            'difficulty_type'=> $this->difficulty_type,
            'difficulty_value'=> $this->difficulty_value,
            'question_type' => $this->question_type,
            'answer' => json_decode($this->answer),
            'choices' => json_decode($this->choices),
            'total_count' => $this->assessment_items_count,
            'correct_count' => $this->correct_count,
            'incorrect_count' => $this->incorrect_count,
            'course' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}

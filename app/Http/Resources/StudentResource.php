<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_filter([
            'student_id' => $this->student_id,
            'name' => $this->name,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'profile_image' => $this->profile_image,
            'birthdate' => $this->birthdate ? (new Carbon($this->birthdate))->format('F j, Y ') : null,
            'gender' => $this->gender,
            'address' => $this->address,
            'course' => $this->course,
            'school' => $this->school,
            'year' => $this->year,
            'age' => $this->age,
            'pretest_completed'=> $this->pretest_completed,
            'created_at'=> (new Carbon($this->created_at))->format('Y-m-d'),
            'student_course_thetas' => StudentThetaScore::collection($this->whenLoaded('student_course_thetas'))
            
        ], function ($value) {
            return !is_null($value) && $value !== '';  // Remove null or empty string values
        });
    }
}

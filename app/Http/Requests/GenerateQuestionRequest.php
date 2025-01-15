<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            '*.course_id' => 'required|integer|min:1', // Validate course_id as a positive integer
            '*.course_title' => 'required|string|max:255', // Ensure course_title is a string and has a maximum length
            '*.difficulty' => 'required|array', // Ensure difficulties is a required array
            '*.difficulty.numOfVeryEasy' => 'integer|min:0', // Validate "Very Easy" as an integer >= 0
            '*.difficulty.numOfEasy' => 'integer|min:0', // Validate "Easy" as an integer >= 0
            '*.difficulty.numOfAverage' => 'integer|min:0', // Validate "Average" as an integer >= 0
            '*.difficulty.numOfHard' => 'integer|min:0', // Validate "Hard" as an integer >= 0
            '*.difficulty.numOfVeryHard' => 'integer|min:0', // Validate "Very Hard" as an integer >= 0
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            '*.course_id.required' => 'Each course must have a valid course_id.',
            '*.course_id.integer' => 'The course_id must be a valid integer.',
            '*.course_id.min' => 'The course_id must be a positive number.',
            '*.course_title.required' => 'Each course must have a title.',
            '*.course_title.string' => 'The course_title must be a valid string.',
            '*.course_title.max' => 'The course_title must not exceed 255 characters.',
            '*.difficulties.required' => 'The difficulties field is required for each course.',
            '*.difficulties.array' => 'The difficulties field must be an array.',
            '*.difficulties.Very Easy.integer' => 'The "Very Easy" value must be an integer.',
            '*.difficulties.Very Easy.min' => 'The "Very Easy" value must be at least 0.',
            '*.difficulties.Easy.integer' => 'The "Easy" value must be an integer.',
            '*.difficulties.Easy.min' => 'The "Easy" value must be at least 0.',
            '*.difficulties.Average.integer' => 'The "Average" value must be an integer.',
            '*.difficulties.Average.min' => 'The "Average" value must be at least 0.',
            '*.difficulties.Hard.integer' => 'The "Hard" value must be an integer.',
            '*.difficulties.Hard.min' => 'The "Hard" value must be at least 0.',
            '*.difficulties.Very Hard.integer' => 'The "Very Hard" value must be an integer.',
            '*.difficulties.Very Hard.min' => 'The "Very Hard" value must be at least 0.',
        ];
    }

}

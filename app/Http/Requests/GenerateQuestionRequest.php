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
            '*.questions' => 'required|array', // Ensure "questions" is a required array
            '*.questions.*.type' => 'required|string|max:255', // Ensure "type" is a required string
            '*.questions.*.difficulty' => 'required|array', // Ensure "difficulty" is a required array
            '*.questions.*.difficulty.numOfVeryEasy' => 'integer|min:0', // Validate "numOfVeryEasy" as an integer >= 0
            '*.questions.*.difficulty.numOfEasy' => 'integer|min:0', // Validate "numOfEasy" as an integer >= 0
            '*.questions.*.difficulty.numOfAverage' => 'integer|min:0', // Validate "numOfAverage" as an integer >= 0
            '*.questions.*.difficulty.numOfHard' => 'integer|min:0', // Validate "numOfHard" as an integer >= 0
            '*.questions.*.difficulty.numOfVeryHard' => 'integer|min:0', // Validate "numOfVeryHard" as an integer >= 0
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
            '*.questions.required' => 'The questions field is required for each course.',
            '*.questions.array' => 'The questions field must be an array.',
            '*.questions.*.type.required' => 'Each question must have a "type" field.',
            '*.questions.*.type.string' => 'The "type" field must be a valid string.',
            '*.questions.*.type.max' => 'The "type" field must not exceed 255 characters.',
            '*.questions.*.difficulty.required' => 'Each question must have a "difficulty" field.',
            '*.questions.*.difficulty.array' => 'The "difficulty" field must be an array.',
            '*.questions.*.difficulty.numOfVeryEasy.integer' => 'The "numOfVeryEasy" value must be an integer.',
            '*.questions.*.difficulty.numOfVeryEasy.min' => 'The "numOfVeryEasy" value must be at least 0.',
            '*.questions.*.difficulty.numOfEasy.integer' => 'The "numOfEasy" value must be an integer.',
            '*.questions.*.difficulty.numOfEasy.min' => 'The "numOfEasy" value must be at least 0.',
            '*.questions.*.difficulty.numOfAverage.integer' => 'The "numOfAverage" value must be an integer.',
            '*.questions.*.difficulty.numOfAverage.min' => 'The "numOfAverage" value must be at least 0.',
            '*.questions.*.difficulty.numOfHard.integer' => 'The "numOfHard" value must be an integer.',
            '*.questions.*.difficulty.numOfHard.min' => 'The "numOfHard" value must be at least 0.',
            '*.questions.*.difficulty.numOfVeryHard.integer' => 'The "numOfVeryHard" value must be an integer.',
            '*.questions.*.difficulty.numOfVeryHard.min' => 'The "numOfVeryHard" value must be at least 0.',
        ];
    }

}

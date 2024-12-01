<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StudentProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->userable instanceof Student;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id'=> 'required',
            'profile_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'birthdate' => 'nullable|date',
            'gender' => ['required', Rule::in(['Male','Female', 'Others'])],
            'address' => 'nullable|string|max:500',
            'school' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:50'
        ];
    }
}

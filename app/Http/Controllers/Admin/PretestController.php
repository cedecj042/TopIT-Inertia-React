<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDetailType;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PretestController extends Controller
{
    //
    public function index(){
        $query = Question::with(['difficulty', 'course', 'question_detail'])->where('test_type','Pretest');

        if ($search = request('question')) {
            $search = strtolower($search); // Convert the search term to lowercase
        
            $query->where(function ($q) use ($search) {
                // Search in the question field (case-insensitive)
                $q->where(DB::raw('LOWER(question)'), 'like', '%' . $search . '%')
                  // Search in the answer field within the question_detail relationship (case-insensitive)
                  ->orWhereHas('question_detail', function ($q) use ($search) {
                      $q->where(DB::raw('LOWER(answer)'), 'like', '%' . $search . '%'); // Adjust if answer is JSON array
                  });
            });
        }

        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->whereHas('difficulty', function ($q) use ($difficulty) {
                $q->where('name', $difficulty); // Assuming 'name' is the field in difficulty table
            });
        }
        if ($detail_types = request('detail_types')) {
            $query->whereHas('question_detail', function ($q) use ($detail_types) {
                $q->where('type', $detail_types); // Assuming 'name' is the field in difficulty table
            });
        }
        

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $difficulty =  DB::table('difficulty')->distinct()->pluck('name');
        $questionDetailTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'detail_types' => $questionDetailTypes
        ];
        
        return Inertia::render('Admin/Questions/Pretest', [
            'title' => 'Admin Pretest',
            'auth' => Auth::user(),
            'questions' => QuestionResource::collection($questions), 
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(){
        $query = Question::with(['difficulty', 'course', 'question_detail'])->where('test_type','Test');

        if ($search = request('question')) {
            $search = strtolower($search); // Convert the search term to lowercase
        
            $query->where(function ($q) use ($search) {
                // Search in the question field (case-insensitive)
                $q->where(DB::raw('LOWER(question)'), 'like', '%' . $search . '%')
                  // Search in the answer field within the question_detail relationship (case-insensitive)
                  ->orWhereHas('question_detail', function ($q) use ($search) {
                      $q->where(DB::raw('LOWER(answer)'), 'like', '%' . $search . '%'); // Adjust if answer is JSON array
                  });
            });
        }
        
        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->whereHas('difficulty', function ($q) use ($difficulty) {
                $q->where('name', $difficulty); // Assuming 'name' is the field in difficulty table
            });
        }
        if ($detail_types = request('detail_types')) {
            $query->whereHas('question_detail', function ($q) use ($detail_types) {
                $q->where('type', $detail_types); // Assuming 'name' is the field in difficulty table
            });
        }
        

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $difficulty =  DB::table('difficulty')->distinct()->pluck('name');
        $questionDetailTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'detail_types' => $questionDetailTypes
        ];
        
        return Inertia::render('Admin/Questions/AddPretest',[
            'title' => 'Admin Pretest',
            'auth' => Auth::user(),
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
        
    }
}

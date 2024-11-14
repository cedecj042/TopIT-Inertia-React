<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDetailType;
use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $query = Question::query()->with(['difficulty','question_detail','course']);

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
        if ($types = request('types')) {
            $query->whereHas('question_detail', function ($q) use ($types) {
                $q->where('type', $types); // Assuming 'name' is the field in difficulty table
            });
        }
        
        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $difficulty =  DB::table('difficulty')->distinct()->pluck('name');
        $questionTypes = collect(QuestionDetailType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
    
        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'types' => $questionTypes,
        ];
        return Inertia::render('Admin/Questions/Question',[
            'title' => 'Admin Question',
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

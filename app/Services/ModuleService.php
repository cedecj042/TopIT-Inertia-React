<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Content;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Exception;
use Log;

class ModuleService
{
    public function resolveModelClass($type)
    {
        return match ($type) {
            'Module' => \App\Models\Module::class,
            'Lesson' => \App\Models\Lesson::class,
            'Section' => \App\Models\Section::class,
            'Subsection' => \App\Models\Subsection::class,
            default => null,
        };
    }

    public function getFilteredModules($request)
    {
        $query = Module::with(['course:course_id,title']);

        $sort = $request->get('sort', ''); // Empty by default
        $sortField = $sortDirection = null;  // Initialize sortField and sortDirection as null
    
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);
    
            // Ensure sortDirection is either 'asc' or 'desc'
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }
        
        if ($title = $request->get('title')) {
            $query->where('title', 'like', "%$title%");
        }

        if ($courseTitle = $request->get('course')) {
            $course = DB::table('courses')->where('title', 'like', "%$courseTitle%")->first();
            $query->where('course_id', $course ? $course->course_id : null);
        }
        
        if ($vectorized = $request->get('vectorized')) {
            if (strtolower($vectorized) === 'saved') {
                $query->where('vectorized', 1); // 1 for indexed
            } elseif (strtolower($vectorized) === 'not saved') {
                $query->where('vectorized', 0); // 0 for not indexed
            }
        }
      
        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Default sorting by `created_at` in descending order
            $query->orderBy('created_at', 'desc');
        }
    

        $filters = [
            'courses' => Course::distinct()->pluck('title'),
            'vectorized' => ['Saved', 'Not saved'], // Add vectorized filter options
        ];
  

        $perPage = $request->get('items', 5);
        return [
            'data' => $query->paginate($perPage)->onEachSide(1),
            'filters' => $filters,
        ];
    }

    function romanToInt($roman)
{
    $map = [
        'I' => 1,
        'V' => 5,
        'X' => 10,
        'L' => 50,
        'C' => 100,
        'D' => 500,
        'M' => 1000,
    ];

    $result = 0;
    $prevValue = 0;

    for ($i = strlen($roman) - 1; $i >= 0; $i--) {
        $currentValue = $map[$roman[$i]];
        if ($currentValue >= $prevValue) {
            $result += $currentValue;
        } else {
            $result -= $currentValue;
        }
        $prevValue = $currentValue;
    }

    return $result;
}


    public function getModuleWithDetails($module_id)
    {
        return Module::with([
            'course:course_id,title',
            'contents' => fn($q) => $q->orderBy('order'),
            'lessons.contents' => fn($q) => $q->orderBy('order'),
            'lessons.sections.contents' => fn($q) => $q->orderBy('order'),
            'lessons.sections.subsections.contents' => fn($q) => $q->orderBy('order'),
        ])->findOrFail($module_id);
    }

    public function updateContentable(array $data, int $id)
    {
        // Resolve the fully qualified class name
        $contentableClass = $this->resolveModelClass($data['contentable_type']);
        if (!$contentableClass) {
            throw new Exception('Invalid contentable_type');
        }

        // Ensure the full class name is set back to contentable_type
        $data['contentable_type'] = $contentableClass;

        // Find the contentable model and update its title
        $contentable = $contentableClass::findOrFail($id);
        $contentable->update(['title' => $data['title']]);

        // Update contents if provided
        if (!empty($data['contents'])) {
            foreach ($data['contents'] as $content) {
                Content::where('content_id', $content['content_id'])
                    ->update(['order' => $content['order']]);
            }
        }

        return $contentable instanceof Module
            ? $contentable->module_id
            : $contentable->module->module_id;
    }

    public function deleteContentable(int $id, string $type)
    {
        $modelClass = $this->resolveModelClass($type);
        if (!$modelClass)
            throw new Exception('Invalid contentable_type');

        $contentable = $modelClass::findOrFail($id);
        $contentable->delete();
    }

    public function getCoursesWithModules()
    {
        return Course::with('modules')->get();
    }
}

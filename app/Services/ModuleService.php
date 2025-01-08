<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Content;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Exception;

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

        if ($title = $request->get('title')) {
            $query->where('title', 'like', "%$title%");
        }

        if ($courseTitle = $request->get('course')) {
            $course = DB::table('courses')->where('title', 'like', "%$courseTitle%")->first();
            $query->where('course_id', $course ? $course->course_id : null);
        }

        $perPage = $request->get('items', 5);
        return [
            'data' => $query->paginate($perPage)->onEachSide(1),
            'filters' => ['courses' => Course::distinct()->pluck('title')],
        ];
    }

    public function getModuleWithDetails($id)
    {
        return Module::with([
            'course:course_id,title',
            'contents' => fn($q) => $q->orderBy('order'),
            'lessons.contents' => fn($q) => $q->orderBy('order'),
            'lessons.sections.contents' => fn($q) => $q->orderBy('order'),
            'lessons.sections.subsections.contents' => fn($q) => $q->orderBy('order'),
        ])->findOrFail($id);
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

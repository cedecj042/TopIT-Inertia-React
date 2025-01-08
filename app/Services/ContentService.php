<?php

namespace App\Services;

use App\Models\Content;
use Exception;
use Log;

class ContentService
{
    protected function resolveModelClass($type)
    {
        $mapping = [
            'Module' => \App\Models\Module::class,
            'Lesson' => \App\Models\Lesson::class,
            'Section' => \App\Models\Section::class,
            'Subsection' => \App\Models\Subsection::class,
        ];

        return $mapping[$type] ?? null;
    }

    protected function getModuleId($contentableType, $contentableId)
    {
        if ($contentableType === 'Module') {
            return $contentableId;
        }

        $modelClass = $this->resolveModelClass($contentableType);
        if (!$modelClass) {
            throw new Exception('Invalid contentable_type');
        }

        $parentModel = $modelClass::findOrFail($contentableId);
        return $parentModel->module->module_id;
    }

    public function createContent(array $data)
    {
        $modelClass = $this->resolveModelClass($data['contentable_type']);
        if (!$modelClass) {
            throw new Exception('Invalid contentable_type');
        }

        $parent = $modelClass::findOrFail($data['contentable_id']);
        $content = $parent->contents()->create([
            'type' => $data['type'],
            'description' => $data['description'] ?? '',
            'caption' => $data['caption'],
            'order' => $data['order'],
            'file_name' => $data['file_name'] ?? '',
            'file_path' => $data['file_path'] ?? '',
            'contentable_type' => $modelClass,
        ]);

        return [
            'content' => $content,
            'moduleId' => $this->getModuleId($data['contentable_type'], $data['contentable_id']),
        ];
    }

    public function updateContent(int $id, array $data)
    {
        $content = Content::findOrFail($id);

        Log::info('Content Update Request:', ['data' => $data]);

        // Resolve the fully qualified class name, but don't overwrite input data
        $resolvedClass = $this->resolveModelClass($data['contentable_type']);
        Log::info('Content Update Request:', ['resolvedClass' => $resolvedClass]);
        if (!$resolvedClass) {
            throw new Exception('Invalid contentable_type');
        }
        $moduleId = $this->getModuleId($data['contentable_type'], $data['contentable_id']);
        $data['contentable_type'] = $resolvedClass;
        $content->update($data);

        return [
            'content' => $content,
            'moduleId' => $moduleId,
        ];
    }


    public function deleteContent(int $id)
    {
        $content = Content::findOrFail($id);
        $baseType = class_basename($content->contentable_type);
        $contentableId = $content->contentable_id;
        $moduleId = $this->getModuleId($baseType, $contentableId);

        $content->delete();

        return [
            'moduleId' => $moduleId,
            'contentableId' => $contentableId,
            'baseType' => $baseType,
        ];
    }
}

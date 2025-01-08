<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id('course_id');
            $table->string('title');
            $table->string('description');
            $table->timestamps();
        });
        Schema::create('pdfs', function (Blueprint $table) {
            $table->id('pdf_id');
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->enum('status', ['Uploading', 'Failed', 'Success','Processing'])->default('Uploading');
            $table->string('uploaded_by');
            $table->timestamps();
        });

        Schema::create('modules', function (Blueprint $table) {
            $table->string('module_id')->primary();
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->boolean('vectorized')->default(false);
            $table->timestamps();
        });

        Schema::create('lessons',function(Blueprint $table){
            $table->string('lesson_id')->primary();
            $table->string('module_id');
            $table->foreign('module_id')->references('module_id')->on('modules')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->timestamps();
        }); 

        Schema::create('sections',function(Blueprint $table){
            $table->string('section_id')->primary();
            $table->string('lesson_id');
            $table->foreign('lesson_id')->references('lesson_id')->on('lessons')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->timestamps();
        });

        Schema::create('subsections',function(Blueprint $table){
            $table->string('subsection_id')->primary();
            $table->string('section_id');
            $table->foreign('section_id')->references('section_id')->on('sections')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pdfs');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('subsection');
    }
};
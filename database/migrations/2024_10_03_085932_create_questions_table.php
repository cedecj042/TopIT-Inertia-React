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
        // Schema::create('',function (Blueprint $table){
        //     $table->id('identification_id');
        //     $table->string('name');
        //     $table->string('answer');
        //     $table->timestamps();
        // });
        // Schema::create('multichoice_single',function (Blueprint $table){
        //     $table->id('multichoice_single_id');
        //     $table->string('name');
        //     $table->string('answer');
        //     $table->json('choices');
        //     $table->timestamps();
        // });
        // Schema::create('multichoice_many',function (Blueprint $table){
        //     $table->id('multichoice_many_id');
        //     $table->string('name');
        //     $table->json('answer');
        //     $table->json('choices');
        //     $table->timestamps();
        // });

        // Schema::create('difficulty', function (Blueprint $table) {
        //     $table->id('difficulty_id');
        //     $table->string('name');
        //     $table->float('numeric');
        //     $table->timestamps();
        // });


        // Schema::create('question_details',function (Blueprint $table){
        //     $table->id('question_detail_id');
        //     $table->enum('type',['Identification','Multiple Choice - Single','Multiple Choice - Many']);
        //     $table->json('answer');
        //     $table->json('choices')->nullable();
        //     $table->boolean('requires_all_answer')->nullable();
        //     $table->timestamps();
        // });
        Schema::create('question_jobs', function (Blueprint $table) {
            $table->id('question_job_id');
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->integer('total_very_easy')->nullable();
            $table->integer('total_easy')->nullable();
            $table->integer('total_average')->nullable();
            $table->integer('total_hard')->nullable();
            $table->integer('total_very_hard')->nullable();
            $table->integer('total_questions')->nullable();
            $table->string('generated_by');
            $table->enum('status', ['Pending', 'Failed', 'Success','Processing'])->default('Pending');
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->string('question_uid')->nullable();
            $table->string('module_uid')->nullable();
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->foreignId('question_job_id')->references('question_job_id')->on('question_jobs')->cascadeOnDelete();
            $table->longText('question');
            $table->float('discrimination_index');
            $table->float('difficulty_value');
            $table->enum('difficulty_type', ['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard']);
            $table->enum('question_type',['Identification','Multiple Choice - Single','Multiple Choice - Many']);
            $table->json('answer');
            $table->json('choices')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generate_questions');
        Schema::dropIfExists('questions');
        // Schema::dropIfExists('question_recalibration_logs');
    }
};
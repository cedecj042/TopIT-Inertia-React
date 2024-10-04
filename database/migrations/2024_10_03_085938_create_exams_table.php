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
        Schema::create('tests',function (Blueprint $table){
            $table->id('test_id');
            $table->foreignID('student_id')->references('student_id')->on('students')->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('totalItems');
            $table->integer('totalScore');
            $table->float('percentage');
            $table->string('status');
            $table->timestamps();
        });
        Schema::create('test_courses',function(Blueprint $table){
            $table->id('test_course_id');
            $table->foreignID('test_id')->references('test_id')->on('tests')->cascadeOnDelete();
            $table->foreignID('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->float('theta_score');
            $table->timestamps();
        });

        Schema::create('test_answers',function (Blueprint $table){
            $table->id('test_answer_id');
            $table->foreignID('test_course_id')->references('test_id')->on('tests')->cascadeOnDelete();
            $table->foreignID('question_id')->references('question_id')->on('questions')->cascadeOnDelete();
            $table->json('participants_answer');
            $table->integer(column: 'score');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
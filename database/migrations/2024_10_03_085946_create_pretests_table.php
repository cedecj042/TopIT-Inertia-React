<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::create('pretests', function (Blueprint $table) {
        //     $table->id('pretest_id');
        //     $table->foreignID('student_id')->references('student_id')->on('students')->cascadeOnDelete();
        //     $table->integer('totalItems');
        //     $table->integer('totalScore');
        //     $table->float('percentage');
        //     $table->string('status');
        //     $table->timestamps();
        // });
        // Schema::create('pretest_courses', function (Blueprint $table) {
        //     $table->id('pretest_course_id');
        //     $table->foreignID('pretest_id')->references('pretest_id')->on('pretests')->cascadeOnDelete();
        //     $table->foreignID('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
        //     $table->float('theta_score');
        //     $table->timestamps();
        // });
        // Schema::create('pretest_questions', function (Blueprint $table) {
        //     $table->id('pretest_question_id');
        //     $table->foreignID('question_id')->references('question_id')->on('questions')->cascadeOnDelete();
        //     $table->timestamps();
        // });
        // Schema::create('pretest_answers', function (Blueprint $table) {
        //     $table->id('pretest_answer_id');
        //     $table->unsignedBigInteger('pretest_course_id');
        //     $table->unsignedBigInteger('pretest_question_id');
        //     $table->foreign('pretest_course_id')->references('pretest_course_id')->on('pretest_courses')->onDelete('cascade');
        //     $table->foreign('pretest_question_id')->references('pretest_question_id')->on('pretest_questions')->onDelete('cascade');
        //     $table->foreignID('pretest_course_id')->references('pretest_id')->on('pretests')->cascadeOnDelete();
        //     $table->foreignID('pretest_question_id')->references('pretest_question_id')->on('pretest_questions')->cascadeOnDelete();
        //     $table->json('participants_answer');
        //     $table->integer(column: 'score');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('pretest_answers');
        // Schema::dropIfExists('pretest_questions');
        // Schema::dropIfExists('pretest_courses');
        // Schema::dropIfExists('pretests');
    }
};
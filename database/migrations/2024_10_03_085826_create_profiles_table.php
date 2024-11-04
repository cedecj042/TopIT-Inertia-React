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
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('profile_image')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable();
            $table->integer('age')->nullable();
            $table->string('address')->nullable();
            $table->string('school');
            $table->string('course');
            $table->integer('year');
            $table->boolean('pretest_completed')->default(false);
            $table->timestamps();
        });
        Schema::create('admins', function (Blueprint $table) {
            $table->id('admin_id'); 
            $table->string('firstname');
            $table->string('lastname');
            $table->string('profile_image')->nullable();
            $table->dateTime('last_login');
            $table->timestamps();
        });
        Schema::create('student_course_thetas', function (Blueprint $table) {
            $table->id('student_course_theta_id');
            $table->foreignId('student_id')->references('student_id')->on('students')->cascadeOnDelete();
            $table->foreignId('course_id')->references('course_id')->on('courses')->cascadeOnDelete();
            $table->float('theta_score');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('coordinators');
        Schema::dropIfExists('student_course_thetas');
    }
};
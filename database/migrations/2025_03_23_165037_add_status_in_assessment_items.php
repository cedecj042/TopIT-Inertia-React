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
        Schema::table('assessment_items', function (Blueprint $table) {
            $table->dropColumn('theta_score');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
            $table->enum('status',['In Progress','Completed'])->default('In Progress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assessment_items', function (Blueprint $table) {
            $table->dropColumn('theta_score');
            $table->dropColumn('status');
        });
    }
};

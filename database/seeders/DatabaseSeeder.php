<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $admin = Admin::create([
            'firstname' => 'Jungkook',
            'lastname' => 'Jeon',
            'profile_image' => 'profile-circle.png', 
            'last_login' => now(),
        ]);

        User::create([
            'username' => 'jjk123',
            'email' => 'jjk@gmail.com',
            'password' => Hash::make('usjr1234'), 
            'userable_id' => $admin->admin_id,
            'userable_type' => Admin::class,
        ]);

        $admin = Admin::create([
            'firstname' => 'admin',
            'lastname' => 'admin',
            'profile_image' => 'profile-circle.png', 
            'last_login' => now(),
        ]);

        User::create([
            'username' => 'admin',
            'email' => 'admin@email.com',
            'password' => Hash::make('usjr1234'), 
            'userable_id' => $admin->admin_id,
            'userable_type' => Admin::class,
        ]);

        $this->call([
            DifficultySeeder::class,
            CourseSeeder::class,
            PretestQuestionSeeder::class,
            QuestionSeeder::class,
            StudentSeeder::class,
            TestSeeder::class,
            TestSeeder::class,
            TestSeeder::class,
        ]);
    }
}
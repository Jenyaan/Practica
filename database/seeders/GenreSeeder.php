<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Genre::create(["name" => "Психологія"]);
        Genre::create(["name" => "Романтика"]);
        Genre::create(["name" => "Класика"]);
        Genre::create(["name" => "Жахи"]);
        Genre::create(["name" => "Фантастика"]);
        Genre::create(["name" => "Фентезі"]);
        Genre::create(["name" => "Бойовик"]);
        Genre::create(["name" => "Наукова фантастика"]);
        Genre::create(["name" => "Технічна"]);
        Genre::create(["name" => "Еротика"]);
    }
}

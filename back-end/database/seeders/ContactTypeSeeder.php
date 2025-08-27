<?php

namespace Database\Seeders;

use App\Models\ContactType;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ContactTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Familiar'],
            ['name' => 'Clientes'],
            ['name' => 'Trabalho'],
            ['name' => 'Amigos'],
            ['name' => 'Leads']
        ];

        foreach ($types as $type) {
            ContactType::create($type);
        }
    }
}

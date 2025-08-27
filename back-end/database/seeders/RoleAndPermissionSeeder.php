<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Criar permissões
        Permission::create(['name' => 'manage contacts']);
        Permission::create(['name' => 'manage contact_types']);

        // Criar role e atribuir permissões
        $role = Role::create(['name' => 'client']);
        $role->givePermissionTo(['manage contacts', 'manage contact_types']);
    }
}

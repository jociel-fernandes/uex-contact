<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViaCepService
{
    public function fetchAddress(string $zipCode)
    {
        $response = Http::get("https://viacep.com.br/ws/{$zipCode}/json/");

        if ($response->successful() && !isset($response->json()['erro'])) {
            return $response->json();
        }

        return null;
    }
}
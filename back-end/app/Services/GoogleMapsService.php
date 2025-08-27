<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    protected $apiKey;
    protected $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    public function __construct()
    {
        $this->apiKey = config('services.google.maps.api_key');
    }

    public function getCoordinates(string $address)
    {

        \Log::debug('baseUrl', [ $this->baseUrl]);
        \Log::debug('api_key', [ $this->apiKey]);
        if (!$this->apiKey) {
            return null;
        }
        
        \Log::debug('address', [ $address]);
        $response = Http::get($this->baseUrl, [
            'address' => $address,
            'key' => $this->apiKey,
        ]);
        \Log::debug('response json', [ $response->json()]);

        if ($response->successful() && $response->json()['status'] === 'OK') {
            return $response->json()['results'][0]['geometry']['location'];
        }

        return null;
    }
}
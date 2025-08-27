<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UEX Contacts</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="mat-typography">
    <app-root></app-root>
    <script src="{{ asset('app/main.js') }}" defer></script>
    <script src="{{ asset('app/polyfills.js') }}" defer></script>
    <script src="{{ asset('app/runtime.js') }}" defer></script>
</body>
</html>
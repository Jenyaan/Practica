<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "author" => $this->author,
            "genres" => $this->genres->map(fn($item) => $item->name),
            "description" => $this->description,
            "tags" => $this->tags,
            "public" => $this->public,
            "formats" => $this->formats->map(fn($item) => $item->name),
            "user_id" => $this->user->id,
        ];
    }
}

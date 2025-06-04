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
            "image_url"=>$this->image_url,
            "author" => $this->author,
            "year" => $this->year,
            "genres" => $this->genres->map(fn($item) => $item->name),
            "description" => $this->description,
            "tags" => $this->tags,
            "bookmarks"=>$this->bookmarks->map(fn($item) => $item->page),
            "public" => $this->public,
            "formats" => $this->formats->map(fn($item) => $item->name),
            "user_id" => $this->user->id,
        ];
    }
}

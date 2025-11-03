terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

resource "docker_image" "postfixadmin" {
  name         = "postfixadmin:fpm-alpine"
  keep_locally = false
}

resource "docker_container" "postfixadmin" {
  image = docker_image.postfixadmin.image_id
  name  = "seeingwhatworks"
  ports {
    internal = 80
    external = 8000
  }
}


provider "google" {
  project = "premium-gear-252201"
  region  = "us-central1"
  zone    = "us-central1-c"
}
resource "google_compute_instance" "microservice-3" {
  name         = "microservice-3"
  machine_type = "f1-micro"
  zone         = "us-central1-c"
  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }
  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }
}
resource "google_compute_firewall" "default" {
 name    = "micro-net3"
 network = "default"

 allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "8080", "1000-2000"]
  }
}

  output "ip" {
     value = "${google_compute_instance.microservice-3.network_interface.0.access_config.0.nat_ip}"
  }

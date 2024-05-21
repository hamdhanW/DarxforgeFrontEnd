import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomePageComponent,MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DarkxForgeAngular';
}

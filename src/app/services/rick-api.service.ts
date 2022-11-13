import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CHARACTERS_API } from '../constants/urls'
import { environment } from '../../environments/environment'
import { RickAndMortyCharactersResponse } from '../models/charactersResponse.model'
import { RickAndMortyCharacter } from '../models/character.model'

@Injectable({
  providedIn: 'root'
})
export class RickApiService {

  constructor(private http: HttpClient) { }

  async getCharacters(
    name: string = '',
    page: number = 1
  ): Promise<RickAndMortyCharactersResponse> {
    return this.http.get<RickAndMortyCharactersResponse>(
        `${environment.apiUrl}/${CHARACTERS_API}?name=${name}&page=${page}`
      ).toPromise()
  }

  async getCharacter(id: number): Promise<RickAndMortyCharacter> {
    return this.http.get<RickAndMortyCharacter>(
        `${environment.apiUrl}/${CHARACTERS_API}/${id}`
      ).toPromise()
  }
}
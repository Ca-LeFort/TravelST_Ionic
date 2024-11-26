import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPage } from './recover.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('Página Recuperar contraseña', () => {
  let component: RecoverPage;
  let fixture: ComponentFixture<RecoverPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoverPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(RecoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página de recuperar constraseña se abre', () => {
    expect(component).toBeTruthy();
  });
});

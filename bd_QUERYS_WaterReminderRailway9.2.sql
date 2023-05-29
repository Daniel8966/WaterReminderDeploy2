

CREATE SCHEMA IF NOT EXISTS `railway` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `railway` ;


CREATE TABLE IF NOT EXISTS `railway`.`privilegio` (
  `idPrivilegio` INT NOT NULL AUTO_INCREMENT,
  `privilegio` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idPrivilegio`))


CREATE TABLE IF NOT EXISTS `railway`.`sexo` (
  `idsexo` INT NOT NULL AUTO_INCREMENT,
  `sexo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idsexo`))


CREATE TABLE IF NOT EXISTS `railway`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `Usuario` VARCHAR(45) NULL DEFAULT NULL,
  `Password` MEDIUMTEXT NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `telefono` VARCHAR(45) NULL,
  `Sesion` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idUsuario`))


CREATE TABLE IF NOT EXISTS `railway`.`persona` (
  `idPersona` INT NOT NULL AUTO_INCREMENT,
  `peso` INT NULL DEFAULT NULL,
  `altura` VARCHAR(10) NULL DEFAULT NULL,
  `edad` INT NULL DEFAULT NULL,
  `meta_agua` VARCHAR(45) NULL DEFAULT NULL,
  `hora_desp` VARCHAR(45) NULL DEFAULT NULL,
  `hora_dormir` VARCHAR(45) NULL DEFAULT NULL,
  `Actividad_fisica` INT NULL DEFAULT NULL,
  `Sexo_idsexo` INT NOT NULL,
  `Privilegio_idPrivilegio` INT NOT NULL,
  `Usuario_idUsuario` INT NOT NULL,
  PRIMARY KEY (`idPersona`, `Sexo_idsexo`, `Privilegio_idPrivilegio`, `Usuario_idUsuario`),
  INDEX `fk_Persona_Sexo1_idx` (`Sexo_idsexo` ASC) VISIBLE,
  INDEX `fk_Persona_Privilegio1_idx` (`Privilegio_idPrivilegio` ASC) VISIBLE,
  INDEX `fk_persona_Usuario1_idx` (`Usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Persona_Privilegio1`
    FOREIGN KEY (`Privilegio_idPrivilegio`)
    REFERENCES `railway`.`privilegio` (`idPrivilegio`),
  CONSTRAINT `fk_Persona_Sexo1`
    FOREIGN KEY (`Sexo_idsexo`)
    REFERENCES `railway`.`sexo` (`idsexo`),
  CONSTRAINT `fk_persona_Usuario1`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `railway`.`usuario` (`idUsuario`))

CREATE TABLE IF NOT EXISTS `railway`.`alarmas` (
  `idAlarmas` INT NOT NULL AUTO_INCREMENT,
  `hora` VARCHAR(10) NULL DEFAULT NULL,
  `minutos` VARCHAR(10) NULL DEFAULT NULL,
  `Persona_idPersona` INT NOT NULL,
  PRIMARY KEY (`idAlarmas`, `Persona_idPersona`),
  INDEX `fk_Alarmas_Persona1_idx` (`Persona_idPersona` ASC) VISIBLE,
  CONSTRAINT `fk_Alarmas_Persona1`
    FOREIGN KEY (`Persona_idPersona`)
    REFERENCES `railway`.`persona` (`idPersona`))


CREATE TABLE IF NOT EXISTS `railway`.`cgrupos` (
  `idCGrupos` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Grupo` VARCHAR(45) NULL DEFAULT NULL,
  `estadoGrupo` INT NULL DEFAULT NULL,
  `adminID` INT NOT NULL,
  PRIMARY KEY (`idCGrupos`, `adminID`),
  INDEX `fk_CGrupos_persona_idx` (`adminID` ASC) VISIBLE,
  CONSTRAINT `fk_CGrupos_persona`
    FOREIGN KEY (`adminID`)
    REFERENCES `railway`.`persona` (`idPersona`))

CREATE TABLE IF NOT EXISTS `railway`.`ctipo_bebida` (
  `idCTipo_bebida` INT NOT NULL,
  `tipo_bebida` VARCHAR(45) NULL DEFAULT NULL,
  `nombre_bebida` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idCTipo_bebida`))

CREATE TABLE IF NOT EXISTS `railway`.`datos_bebida` (
  `idRegistro_bebida` INT NOT NULL,
  `agua_bebida` INT NULL DEFAULT NULL,
  `cal_bebida` INT NULL DEFAULT NULL,
  `azucar_bebida` INT NULL DEFAULT NULL,
  `CTipo_bebida_idCTipo_bebida` INT NOT NULL,
  PRIMARY KEY (`idRegistro_bebida`, `CTipo_bebida_idCTipo_bebida`),
  INDEX `fk_Registro_bebida_CTipo_bebida1_idx` (`CTipo_bebida_idCTipo_bebida` ASC) VISIBLE,
  CONSTRAINT `fk_Registro_bebida_CTipo_bebida1`
    FOREIGN KEY (`CTipo_bebida_idCTipo_bebida`)
    REFERENCES `railway`.`ctipo_bebida` (`idCTipo_bebida`))

CREATE TABLE IF NOT EXISTS `railway`.`consumo_agua` (
  `idConsumo_Agua` INT NOT NULL AUTO_INCREMENT,
  `Consumo_Total` INT NULL DEFAULT NULL,
  `Fecha` DATE NULL DEFAULT NULL,
  `Persona_idPersona` INT NOT NULL,
  `datos_bebida_idRegistro_bebida` INT NOT NULL,
  `datos_bebida_CTipo_bebida_idCTipo_bebida` INT NOT NULL,
  PRIMARY KEY (`idConsumo_Agua`, `Persona_idPersona`, `datos_bebida_idRegistro_bebida`, `datos_bebida_CTipo_bebida_idCTipo_bebida`),
  INDEX `fk_Consumo_Agua_Persona1_idx` (`Persona_idPersona` ASC) VISIBLE,
  INDEX `fk_consumo_agua_datos_bebida1_idx` (`datos_bebida_idRegistro_bebida` ASC, `datos_bebida_CTipo_bebida_idCTipo_bebida` ASC) VISIBLE,
  CONSTRAINT `fk_consumo_agua_datos_bebida1`
    FOREIGN KEY (`datos_bebida_idRegistro_bebida` , `datos_bebida_CTipo_bebida_idCTipo_bebida`)
    REFERENCES `railway`.`datos_bebida` (`idRegistro_bebida` , `CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_Consumo_Agua_Persona1`
    FOREIGN KEY (`Persona_idPersona`)
    REFERENCES `railway`.`persona` (`idPersona`))


CREATE TABLE IF NOT EXISTS `railway`.`persona_has_cgrupos` (
  `Persona_Grupoid` INT NOT NULL AUTO_INCREMENT,
  `persona_idPersona` INT NOT NULL,
  `CGrupos_idCGrupos` INT NOT NULL,
  PRIMARY KEY (`Persona_Grupoid`, `persona_idPersona`, `CGrupos_idCGrupos`),
  INDEX `fk_persona_has_CGrupos_CGrupos1_idx` (`CGrupos_idCGrupos` ASC) VISIBLE,
  INDEX `fk_persona_has_CGrupos_persona1_idx` (`persona_idPersona` ASC) VISIBLE,
  CONSTRAINT `fk_persona_has_CGrupos_CGrupos1`
    FOREIGN KEY (`CGrupos_idCGrupos`)
    REFERENCES `railway`.`cgrupos` (`idCGrupos`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_persona_has_CGrupos_persona1`
    FOREIGN KEY (`persona_idPersona`)
    REFERENCES `railway`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)


insert into sexo values ( 1, 'hombre' ), (2 , 'mujer');
insert into privilegio values (1, 'usuario');
insert into privilegio values ( 2 , 'admin');
insert into ctipo_bebida values (1 , 'agua', 'agua') ;
insert into datos_bebida values (1 , 100, 0,0, 1 ) ;
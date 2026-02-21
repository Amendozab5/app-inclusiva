package ec.edu.uteq.app.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final Key key;
    private final long expirationMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMinutes = expirationMinutes;
    }

    public String generarToken(String subject, Map<String, Object> extraClaims) {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime exp = now.plusMinutes(expirationMinutes);

        return Jwts.builder()
                .setSubject(subject)
                .addClaims(extraClaims)
                .setIssuedAt(Date.from(now.toInstant()))
                .setExpiration(Date.from(exp.toInstant()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extraerClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extraerSubject(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean tokenEsValido(String token, UserDetails userDetails) {
        try {
            String subject = extraerSubject(token);

            // Si es un UsuarioDetails (el nuestro), comparamos por ID
            if (userDetails instanceof ec.edu.uteq.app.service.UsuarioDetails ud) {
                return subject.equals(String.valueOf(ud.getId())) && !tokenExpirado(token);
            }

            // Fallback por si acaso
            return subject.equals(userDetails.getUsername()) && !tokenExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean tokenExpirado(String token) {
        Date exp = extraerClaims(token).getExpiration();
        return exp.before(new Date());
    }
}
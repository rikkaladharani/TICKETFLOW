package com.ticketflow.backend.config;

import com.ticketflow.backend.entity.Event;
import com.ticketflow.backend.entity.EventSeat;
import com.ticketflow.backend.entity.Seat;
import com.ticketflow.backend.entity.VenueSection;
import com.ticketflow.backend.entity.User;
import com.ticketflow.backend.entity.Venue;
import com.ticketflow.backend.repository.EventRepository;
import com.ticketflow.backend.repository.EventSeatRepository;
import com.ticketflow.backend.repository.SeatRepository;
import com.ticketflow.backend.repository.UserRepository;
import com.ticketflow.backend.repository.VenueRepository;
import com.ticketflow.backend.repository.VenueSectionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final VenueSectionRepository venueSectionRepository;
    private final SeatRepository seatRepository;
    private final EventSeatRepository eventSeatRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VenueRepository venueRepository,
                           EventRepository eventRepository,
                           VenueSectionRepository venueSectionRepository,
                           SeatRepository seatRepository,
                           EventSeatRepository eventSeatRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.venueSectionRepository = venueSectionRepository;
        this.seatRepository = seatRepository;
        this.eventSeatRepository = eventSeatRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedOrUpdateUser("admin@ticketflow.com", "admin123", "ADMIN", "System", "Admin", "9876543210");
        User organizer = seedOrUpdateUser("organizer@ticketflow.com", "organizer123", "ORGANIZER", "Event", "Organizer", "9876543211");
        seedOrUpdateUser("customer@ticketflow.com", "customer123", "CUSTOMER", "Jane", "Customer", "9876543212");
        seedOrUpdateUser("stallowner@ticketflow.com", "stallowner123", "STALL_OWNER", "Bob", "StallOwner", "9876543213");

        updatePasswordIfPresent("admin@gmail.com", "admin123");
        updatePasswordIfPresent("organizer@test.com", "organizer123");
        updatePasswordIfPresent("test@example.com", "customer123");
        updatePasswordIfPresent("stall@test.com", "stallowner123");

        // Add demo venues only when the database has none, so existing user data is preserved.
        if (venueRepository.count() == 0) {
            List<Venue> venues = new ArrayList<>();
            venues.add(venue("Hyderabad Arena", "Gachibowli Stadium Road", "Hyderabad", 18000,
                    "CONCERT", "A large open-air venue for live music and festivals.",
                    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"));
            venues.add(venue("Hitech City Convention Centre", "HITEC City, Madhapur", "Hyderabad", 4500,
                    "AUDITORIUM", "Modern indoor venue for conferences, shows and performances.",
                    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"));
            venues.add(venue("Ramoji Celebration Grounds", "Ramoji Film City", "Hyderabad", 10000,
                    "FESTIVAL", "Spacious event grounds for festivals and cultural celebrations.",
                    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"));
            venues.add(venue("City Sports Stadium", "Uppal Main Road", "Hyderabad", 25000,
                    "STADIUM", "Multi-purpose stadium for sports and large public events.",
                    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80"));
            venues.add(venue("Lakeside Open Theatre", "Durgam Cheruvu, Madhapur", "Hyderabad", 2200,
                    "CONCERT", "An intimate outdoor setting for acoustic music and comedy.",
                    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80"));
            venueRepository.saveAll(venues);
        }

        // Approved demo events make the customer-facing event pages useful on first launch.
        if (eventRepository.count() == 0) {
            List<Venue> venues = venueRepository.findAll();
            if (!venues.isEmpty()) {
                Venue arena = findVenue(venues, "Hyderabad Arena", 0);
                Venue convention = findVenue(venues, "Hitech City Convention Centre", 1);
                Venue grounds = findVenue(venues, "Ramoji Celebration Grounds", 2);
                Venue stadium = findVenue(venues, "City Sports Stadium", 3);
                Venue theatre = findVenue(venues, "Lakeside Open Theatre", 4);
                LocalDate base = LocalDate.now();
                List<Event> events = new ArrayList<>();
                events.add(event("Hyderabad Live Music Festival", "An evening of live music, lights and performances featuring popular local artists.", "MUSIC",
                        base.plusDays(14), LocalTime.of(18, 30), LocalTime.of(22, 30), organizer, arena,
                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"));
                events.add(event("Indie Waves Concert", "Discover rising indie bands and enjoy a high-energy live concert.", "MUSIC",
                        base.plusDays(21), LocalTime.of(19, 0), LocalTime.of(22, 0), organizer, theatre,
                        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80"));
                events.add(event("Hyderabad Comedy Night", "A live stand-up comedy show with a lineup of fresh and established performers.", "COMEDY",
                        base.plusDays(10), LocalTime.of(19, 30), LocalTime.of(21, 30), organizer, convention,
                        "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80"));
                events.add(event("Deccan Food & Culture Festival", "Taste local favourites, explore stalls and enjoy cultural performances.", "FESTIVAL",
                        base.plusDays(28), LocalTime.of(16, 0), LocalTime.of(22, 0), organizer, grounds,
                        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"));
                events.add(event("City Football Showdown", "A live sporting event for fans, families and football lovers.", "SPORTS",
                        base.plusDays(18), LocalTime.of(17, 0), LocalTime.of(20, 0), organizer, stadium,
                        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80"));
                events.add(event("Tech & Innovation Summit", "Talks, networking and demonstrations covering new technology and startup ideas.", "CONFERENCE",
                        base.plusDays(35), LocalTime.of(10, 0), LocalTime.of(17, 0), organizer, convention,
                        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"));
                eventRepository.saveAll(events);
            }
        }

        // Add creative and hands-on workshops even if the database already contains events.
        seedExtraEvents(organizer);

        // Ensure every demo venue has a real seat map and every demo event has bookable seats.
        // This repairs databases created by earlier versions that had events but no seats.
        ensureVenueSeats();
        ensureEventSeats();
    }

    private void seedExtraEvents(User organizer) {
        List<Venue> venues = venueRepository.findAll();
        if (venues.isEmpty()) return;
        Venue convention = findVenue(venues, "Hitech City Convention Centre", 0);
        Venue theatre = findVenue(venues, "Lakeside Open Theatre", Math.min(1, venues.size() - 1));
        Venue grounds = findVenue(venues, "Ramoji Celebration Grounds", Math.min(2, venues.size() - 1));
        LocalDate base = LocalDate.now();
        List<Event> existing = eventRepository.findAll();
        List<Event> additions = new ArrayList<>();
        addIfMissing(additions, existing, event("Pottery for Beginners Workshop", "A relaxing, hands-on pottery session. Learn basic hand-building techniques and make a small keepsake to take home. Materials are included.", "WORKSHOP", base.plusDays(7), LocalTime.of(11, 0), LocalTime.of(13, 0), organizer, convention,
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"));
        addIfMissing(additions, existing, event("Paint & Sip Art Workshop", "Explore colour, canvas and creativity in a guided beginner-friendly painting workshop. All art supplies are provided.", "WORKSHOP", base.plusDays(12), LocalTime.of(15, 0), LocalTime.of(17, 30), organizer, theatre,
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"));
        addIfMissing(additions, existing, event("Terrarium & Plant Styling Workshop", "Build your own mini indoor garden and learn simple plant-care tips from local makers.", "WORKSHOP", base.plusDays(16), LocalTime.of(10, 30), LocalTime.of(12, 30), organizer, convention,
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80"));
        addIfMissing(additions, existing, event("Coffee Brewing Masterclass", "Discover grind size, brewing methods and tasting notes in an interactive coffee workshop.", "WORKSHOP", base.plusDays(20), LocalTime.of(10, 0), LocalTime.of(12, 0), organizer, theatre,
                "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80"));
        addIfMissing(additions, existing, event("Handmade Candle Making Workshop", "Design and pour your own scented candle with guidance on wax, fragrance and finishing.", "WORKSHOP", base.plusDays(24), LocalTime.of(14, 0), LocalTime.of(16, 0), organizer, grounds,
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80"));
        addIfMissing(additions, existing, event("Indie Music & Open Mic Evening", "A friendly evening of acoustic performances, new voices and open-mic sets.", "MUSIC", base.plusDays(26), LocalTime.of(18, 0), LocalTime.of(21, 0), organizer, theatre,
                "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"));
        if (!additions.isEmpty()) eventRepository.saveAll(additions);
    }

    private void addIfMissing(List<Event> additions, List<Event> existing, Event candidate) {
        boolean found = existing.stream().anyMatch(e -> candidate.getTitle().equalsIgnoreCase(e.getTitle()));
        if (!found) additions.add(candidate);
    }

    private void ensureVenueSeats() {
        for (Venue venue : venueRepository.findAll()) {
            List<VenueSection> sections = venueSectionRepository.findByVenue(venue);
            if (sections.isEmpty()) {
                VenueSection section = new VenueSection();
                section.setName("Main Floor");
                section.setSectionType("STANDARD");
                section.setRowCount(6);
                section.setSeatsPerRow(10);
                section.setVenue(venue);
                sections = List.of(venueSectionRepository.save(section));
            }
            for (VenueSection section : sections) {
                if (seatRepository.countBySection(section) == 0) {
                    List<Seat> generated = new ArrayList<>();
                    for (int row = 0; row < Math.min(section.getRowCount(), 8); row++) {
                        for (int number = 1; number <= Math.min(section.getSeatsPerRow(), 12); number++) {
                            Seat seat = new Seat();
                            seat.setSeatRow(String.valueOf((char) ('A' + row)));
                            seat.setSeatNumber(number);
                            seat.setSeatType(section.getSectionType());
                            seat.setPrice("VIP".equalsIgnoreCase(section.getSectionType()) ? 1200.0 : 500.0);
                            seat.setStatus("AVAILABLE");
                            seat.setSection(section);
                            generated.add(seat);
                        }
                    }
                    if (!generated.isEmpty()) seatRepository.saveAll(generated);
                }
            }
        }
    }

    private void ensureEventSeats() {
        for (Event event : eventRepository.findAll()) {
            if (event.getVenue() == null || eventSeatRepository.existsByEvent(event)) continue;
            List<Seat> venueSeats = seatRepository.findAll().stream()
                    .filter(seat -> seat.getSection() != null && seat.getSection().getVenue() != null
                            && seat.getSection().getVenue().getId().equals(event.getVenue().getId()))
                    .toList();
            List<EventSeat> generated = new ArrayList<>();
            for (Seat seat : venueSeats) {
                EventSeat eventSeat = new EventSeat();
                eventSeat.setEvent(event);
                eventSeat.setSeat(seat);
                eventSeat.setPrice(seat.getPrice());
                eventSeat.setStatus("AVAILABLE");
                generated.add(eventSeat);
            }
            if (!generated.isEmpty()) eventSeatRepository.saveAll(generated);
        }
    }

    private Venue venue(String name, String address, String city, int capacity, String layout,
                        String description, String imageUrl) {
        Venue venue = new Venue();
        venue.setName(name);
        venue.setAddress(address);
        venue.setCity(city);
        venue.setCapacity(capacity);
        venue.setLayoutType(layout);
        venue.setDescription(description);
        venue.setImageUrl(imageUrl);
        return venue;
    }

    private Event event(String title, String description, String category, LocalDate date,
                        LocalTime start, LocalTime end, User organizer, Venue venue, String imageUrl) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(category);
        event.setEventDate(date);
        event.setStartTime(start);
        event.setEndTime(end);
        event.setStatus("APPROVED");
        event.setOrganizer(organizer);
        event.setVenue(venue);
        event.setImageUrl(imageUrl);
        event.setHasStalls("FESTIVAL".equals(category));
        return event;
    }

    private Venue findVenue(List<Venue> venues, String name, int fallbackIndex) {
        return venues.stream().filter(v -> name.equalsIgnoreCase(v.getName())).findFirst()
                .orElse(venues.get(Math.min(fallbackIndex, venues.size() - 1)));
    }

    private User seedOrUpdateUser(String email, String plainPassword, String role,
                                  String firstName, String lastName, String phone) {
        Optional<User> existing = userRepository.findByEmail(email);
        User user = existing.orElseGet(User::new);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setRole(role);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    private void updatePasswordIfPresent(String email, String plainPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(plainPassword));
            userRepository.save(user);
        });
    }
}
